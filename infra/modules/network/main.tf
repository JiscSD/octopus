data "aws_availability_zones" "available" {}

data "aws_ssm_parameter" "vpc_cidr_block" {
  name = "vpc_cidr_block_${var.environment}_${var.project_name}"
}

data "aws_ssm_parameter" "public_subnets" {
  name = "vpc_public_subnets_${var.environment}_${var.project_name}"
}

data "aws_ssm_parameter" "private_subnets" {
  name = "vpc_private_subnets_${var.environment}_${var.project_name}"
}

locals {
  public_subnets_map  = jsondecode(data.aws_ssm_parameter.public_subnets.value)
  private_subnets_map = jsondecode(data.aws_ssm_parameter.private_subnets.value)
}

resource "aws_vpc" "main" {
  cidr_block           = data.aws_ssm_parameter.vpc_cidr_block.value
  enable_dns_support   = true
  enable_dns_hostnames = true

  assign_generated_ipv6_cidr_block = true

  tags = {
    Name = "${var.environment}_${var.project_name}_vpc"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.environment}_${var.project_name}_igw"
  }
}

# AZ 1
resource "aws_subnet" "public_az1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = local.public_subnets_map[0]
  availability_zone = data.aws_availability_zones.available.names[0]

  tags = {
    Name = "${var.environment}_${var.project_name}_public_subnet_az1"
  }
}

resource "aws_subnet" "private_az1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = local.private_subnets_map[0]
  availability_zone = data.aws_availability_zones.available.names[0]

  tags = {
    Name = "${var.environment}_${var.project_name}_private_subnet_az1"
  }
}

# AZ 2
resource "aws_subnet" "public_az2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = local.public_subnets_map[1]
  availability_zone = data.aws_availability_zones.available.names[1]

  tags = {
    Name = "${var.environment}_${var.project_name}_public_subnet_az2"
  }
}

resource "aws_subnet" "private_az2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = local.private_subnets_map[1]
  availability_zone = data.aws_availability_zones.available.names[1]

  tags = {
    Name = "${var.environment}_${var.project_name}_private_subnet_az2"
  }
}

# AZ 3

resource "aws_subnet" "public_az3" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = local.public_subnets_map[2]
  availability_zone = data.aws_availability_zones.available.names[2]

  tags = {
    Name = "${var.environment}_${var.project_name}_public_subnet_az3"
  }
}

resource "aws_subnet" "private_az3" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = local.private_subnets_map[2]
  availability_zone = data.aws_availability_zones.available.names[2]

  tags = {
    Name = "${var.environment}_${var.project_name}_private_subnet_az3"
  }
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.environment}_octopus_route_table"
  }
}

resource "aws_route" "vpc_public_route" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.igw.id
}

resource "aws_route_table_association" "public_az1" {
  subnet_id      = aws_subnet.public_az1.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_az2" {
  subnet_id      = aws_subnet.public_az2.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_az3" {
  subnet_id      = aws_subnet.public_az3.id
  route_table_id = aws_route_table.public.id
}


resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.environment}_${var.project_name}_private_route_table"
  }
}

resource "aws_route" "vpc_private_route" {
  route_table_id         = aws_route_table.private.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.nat.id
}

resource "aws_route_table_association" "private_az1" {
  subnet_id      = aws_subnet.private_az1.id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "private_az2" {
  subnet_id      = aws_subnet.private_az2.id
  route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "private_az3" {
  subnet_id      = aws_subnet.private_az3.id
  route_table_id = aws_route_table.private.id
}

# security group for serverless
resource "aws_security_group" "sls_sg" {
  name        = "${var.environment}_${var.project_name}_sls_api_sg"
  description = "Allow TLS inbound traffic from IPv4/6"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "everyone"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "security_group_for_serverless_api_platform_${var.environment}"
  }
}

# NAT

resource "aws_eip" "nat_eip" {
  domain     = "vpc"
  depends_on = [aws_internet_gateway.igw]

  tags = {
    Name = "${var.environment}_octopus_nat_eip"
  }
}

resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.public_az1.id
  depends_on    = [aws_internet_gateway.igw]
  tags = {
    Name = "${var.environment}_octopus_nat"
  }
}

# SSM

resource "aws_ssm_parameter" "vpc_id" {
  name  = "${var.environment}_${var.project_name}_vpc_id"
  type  = "String"
  value = aws_vpc.main.id
}

resource "aws_ssm_parameter" "public_subnet_az1" {
  name  = "${var.environment}_${var.project_name}_public_subnet_az1"
  type  = "String"
  value = aws_subnet.public_az1.id
}

resource "aws_ssm_parameter" "public_subnet_az2" {
  name  = "${var.environment}_${var.project_name}_public_subnet_az2"
  type  = "String"
  value = aws_subnet.public_az2.id
}

resource "aws_ssm_parameter" "public_subnet_az3" {
  name  = "${var.environment}_${var.project_name}_public_subnet_az3"
  type  = "String"
  value = aws_subnet.public_az3.id
}

resource "aws_ssm_parameter" "private_subnet_az1" {
  name  = "${var.environment}_${var.project_name}_private_subnet_az1"
  type  = "String"
  value = aws_subnet.private_az1.id
}

resource "aws_ssm_parameter" "private_subnet_az2" {
  name  = "${var.environment}_${var.project_name}_private_subnet_az2"
  type  = "String"
  value = aws_subnet.private_az2.id
}

resource "aws_ssm_parameter" "private_subnet_az3" {
  name  = "${var.environment}_${var.project_name}_private_subnet_az3"
  type  = "String"
  value = aws_subnet.private_az3.id
}

resource "aws_ssm_parameter" "sls_sg" {
  name  = "${var.environment}_${var.project_name}_sls_sg"
  type  = "String"
  value = aws_security_group.sls_sg.id
}

