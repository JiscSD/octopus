data "aws_region" "current" {}

locals {
  region_name = data.aws_region.current.name
}

resource "aws_ecr_repository" "ecr" {
  name                 = "${var.project_name}-${var.environment}"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

// Below is all stuff to allow ECS tasks to pull images from this ECR.
resource "aws_security_group" "vpc_endpoints" {
  name_prefix = "${var.project_name}-vpc-endpoint-${var.environment}"
  description = "Associated to ECR/s3 VPC Endpoints"
  vpc_id      = var.vpc_id

  ingress {
    description     = "Allow ECS tasks to pull images from ECR via VPC endpoints"
    protocol        = "tcp"
    from_port       = 443
    to_port         = 443
    security_groups = [var.task_security_group_id]
  }
}

resource "aws_vpc_endpoint" "ecr_endpoint" {
  vpc_id              = var.vpc_id
  service_name        = "com.amazonaws.${local.region_name}.ecr.dkr"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true

  security_group_ids = [aws_security_group.vpc_endpoints.id]
  subnet_ids         = var.private_subnet_ids
}

resource "aws_vpc_endpoint" "ecr_api_endpoint" {
  vpc_id              = var.vpc_id
  service_name        = "com.amazonaws.${local.region_name}.ecr.api"
  vpc_endpoint_type   = "Interface"
  private_dns_enabled = true

  security_group_ids = [aws_security_group.vpc_endpoints.id]
  subnet_ids         = var.private_subnet_ids
}

resource "aws_vpc_endpoint" "ecr_s3_endpoint" {
  vpc_id            = var.vpc_id
  service_name      = "com.amazonaws.${local.region_name}.s3"
  vpc_endpoint_type = "Gateway"

  route_table_ids = [var.private_route_table_id]
}
