resource "aws_service_discovery_private_dns_namespace" "namespace" {
  name        = "${var.project_name}-namespace-${var.environment}"
  description = "Namespace for ${var.project_name} ECS service"
  vpc         = var.vpc_id

  tags = {
    Name = "${var.project_name}-namespace-${var.environment}"
  }
}

resource "aws_service_discovery_service" "discovery-service" {
  name = "${var.project_name}-ds-${var.environment}"

  dns_config {
    namespace_id   = aws_service_discovery_private_dns_namespace.namespace.id
    routing_policy = "MULTIVALUE"

    dns_records {
      ttl  = 60
      type = "A"
    }
  }

  health_check_custom_config {
    failure_threshold = 1
  }

  tags = {
    Name = "${var.project_name}-ds-${var.environment}"
  }
}

resource "aws_ecs_cluster" "ecs" {
  name = "${var.project_name}-ecs-${var.environment}"

  configuration {
    execute_command_configuration {
      logging = "DEFAULT"
    }
  }

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  service_connect_defaults {
    namespace = aws_service_discovery_private_dns_namespace.namespace.arn
  }
}

resource "aws_ssm_parameter" "ecs-cluster-arn" {
  name  = "ecs_cluster_arn_${var.environment}_${var.project_name}"
  type  = "String"
  value = aws_ecs_cluster.ecs.arn
}
