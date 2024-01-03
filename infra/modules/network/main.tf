data "aws_availability_zones" "available" {}

data "aws_ssm_parameter" "vpc_cidr_block_new" {
  name = "vpc_cidr_block_${var.environment}_${var.project_name}"
}

data "aws_ssm_parameter" "public_subnets_new" {
  name = "vpc_public_subnets_${var.environment}_${var.project_name}"
}

data "aws_ssm_parameter" "private_subnets_new" {
  name = "vpc_private_subnets_${var.environment}_${var.project_name}"
}

locals {
  public_subnets_map  = jsondecode(data.aws_ssm_parameter.public_subnets_new.value)
  private_subnets_map = jsondecode(data.aws_ssm_parameter.private_subnets_new.value)
}

resource "aws_vpc" "main_new" {
  cidr_block           = data.aws_ssm_parameter.vpc_cidr_block_new.value
  enable_dns_support   = true
  enable_dns_hostnames = true

  assign_generated_ipv6_cidr_block = true

  tags = {
    Name = "${var.environment}_${var.project_name}_vpc_new"
  }
}

resource "aws_internet_gateway" "igw_new" {
  vpc_id = aws_vpc.main_new.id

  tags = {
    Name = "${var.environment}_${var.project_name}_igw_new"
  }
}


# AZ 1
resource "aws_subnet" "public_az1_new" {
  vpc_id            = aws_vpc.main_new.id
  cidr_block        = local.public_subnets_map[0]
  availability_zone = data.aws_availability_zones.available.names[0]

  tags = {
    Name = "${var.environment}_${var.project_name}_public_subnet_az1_new"
  }
}

resource "aws_subnet" "private_az1_new" {
  vpc_id            = aws_vpc.main_new.id
  cidr_block        = local.private_subnets_map[0]
  availability_zone = data.aws_availability_zones.available.names[0]

  tags = {
    Name = "${var.environment}_${var.project_name}_private_subnet_az1_new"
  }
}

# AZ 2

resource "aws_subnet" "public_az2_new" {
  vpc_id            = aws_vpc.main_new.id
  cidr_block        = local.public_subnets_map[1]
  availability_zone = data.aws_availability_zones.available.names[1]

  tags = {
    Name = "${var.environment}_${var.project_name}_public_subnet_az2_new"
  }
}

resource "aws_subnet" "private_az2_new" {
  vpc_id            = aws_vpc.main_new.id
  cidr_block        = local.private_subnets_map[1]
  availability_zone = data.aws_availability_zones.available.names[1]

  tags = {
    Name = "${var.environment}_${var.project_name}_private_subnet_az2_new"
  }
}

# AZ 3

resource "aws_subnet" "public_az3_new" {
  vpc_id            = aws_vpc.main_new.id
  cidr_block        = local.public_subnets_map[2]
  availability_zone = data.aws_availability_zones.available.names[2]

  tags = {
    Name = "${var.environment}_${var.project_name}_public_subnet_az3_new"
  }
}

resource "aws_subnet" "private_az3_new" {
  vpc_id            = aws_vpc.main_new.id
  cidr_block        = local.private_subnets_map[2]
  availability_zone = data.aws_availability_zones.available.names[2]

  tags = {
    Name = "${var.environment}_${var.project_name}_private_subnet_az3_new"
  }
}

resource "aws_route_table" "public_new" {
  vpc_id = aws_vpc.main_new.id

  tags = {
    Name = "${var.environment}_octopus_route_table_new"
  }
}

resource "aws_route" "vpc_public_route_new" {
  route_table_id         = aws_route_table.public_new.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.igw_new.id
}

resource "aws_route_table_association" "public_az1_new" {
  subnet_id      = aws_subnet.public_az1_new.id
  route_table_id = aws_route_table.public_new.id
}

resource "aws_route_table_association" "public_az2_new" {
  subnet_id      = aws_subnet.public_az2_new.id
  route_table_id = aws_route_table.public_new.id
}

resource "aws_route_table_association" "public_az3_new" {
  subnet_id      = aws_subnet.public_az3_new.id
  route_table_id = aws_route_table.public_new.id
}


resource "aws_route_table" "private_new" {
  vpc_id = aws_vpc.main_new.id

  tags = {
    Name = "${var.environment}_${var.project_name}_private_route_table_new"
  }
}

resource "aws_route" "vpc_private_route_new" {
  route_table_id         = aws_route_table.private_new.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id         = aws_nat_gateway.nat_new.id
}

resource "aws_route_table_association" "private_az1_new" {
  subnet_id      = aws_subnet.private_az1_new.id
  route_table_id = aws_route_table.private_new.id
}

resource "aws_route_table_association" "private_az2_new" {
  subnet_id      = aws_subnet.private_az2_new.id
  route_table_id = aws_route_table.private_new.id
}

resource "aws_route_table_association" "private_az3_new" {
  subnet_id      = aws_subnet.private_az3_new.id
  route_table_id = aws_route_table.private_new.id
}

# security group for serverless
resource "aws_security_group" "sls_sg_new" {
  name        = "${var.environment}_${var.project_name}_sls_api_sg_new"
  description = "Allow TLS inbound traffic from IPv4/6"
  vpc_id      = aws_vpc.main_new.id

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
    Name = "security_group_for_serverless_api_platform_${var.environment}_new"
  }
}

# NAT

resource "aws_eip" "nat_eip_new" {
  domain     = "vpc"
  depends_on = [aws_internet_gateway.igw_new]

  tags = {
    Name = "${var.environment}_octopus_nat_eip_new"
  }
}

resource "aws_nat_gateway" "nat_new" {
  allocation_id = aws_eip.nat_eip_new.id
  subnet_id     = aws_subnet.public_az1_new.id
  depends_on    = [aws_internet_gateway.igw_new]
  tags = {
    Name = "${var.environment}_octopus_nat_new"
  }
}


# SSM

resource "aws_ssm_parameter" "vpc_id_new" {
  name  = "${var.environment}_${var.project_name}_vpc_id_new"
  type  = "String"
  value = aws_vpc.main_new.id
}

resource "aws_ssm_parameter" "public_subnet_az1_new" {
  name  = "${var.environment}_${var.project_name}_public_subnet_az1"
  type  = "String"
  value = aws_subnet.public_az1_new.id
}

resource "aws_ssm_parameter" "public_subnet_az2_new" {
  name  = "${var.environment}_${var.project_name}_public_subnet_az2"
  type  = "String"
  value = aws_subnet.public_az2_new.id
}
resource "aws_ssm_parameter" "public_subnet_az3_new" {
  name  = "${var.environment}_${var.project_name}_public_subnet_az3"
  type  = "String"
  value = aws_subnet.public_az3_new.id
}
resource "aws_ssm_parameter" "private_subnet_az1_new" {
  name  = "${var.environment}_${var.project_name}_private_subnet_az1"
  type  = "String"
  value = aws_subnet.private_az1_new.id
}
resource "aws_ssm_parameter" "private_subnet_az2_new" {
  name  = "${var.environment}_${var.project_name}_private_subnet_az2"
  type  = "String"
  value = aws_subnet.private_az2_new.id
}
resource "aws_ssm_parameter" "private_subnet_az3_new" {
  name  = "${var.environment}_${var.project_name}_private_subnet_az3"
  type  = "String"
  value = aws_subnet.private_az3_new.id
}
resource "aws_ssm_parameter" "sls_sg_new" {
  name  = "${var.environment}_${var.project_name}_sls_sg"
  type  = "String"
  value = aws_security_group.sls_sg_new.id
}
