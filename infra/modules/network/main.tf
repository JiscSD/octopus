data "aws_availability_zones" "available" {}

resource "aws_vpc" "main" {
    cidr_block              = var.cidr_block
    enable_dns_support      = true
    enable_dns_hostnames    = true

    tags = {
        Name = "${var.environment}_${var.project_name}_vpc"
    }
}

resource "aws_subnet" "public_1" {
    vpc_id                          = aws_vpc.main.id
    cidr_block                      = var.public_subnets[0]
    availability_zone               = data.aws_availability_zones.available.names[0]
    map_public_ip_on_launch         = false
    assign_ipv6_address_on_creation = false

    tags = {
        Name = "${var.environment}_${var.project_name}_public_subnet_1"
    }
}

resource "aws_subnet" "public_2" {
    vpc_id                          = aws_vpc.main.id
    cidr_block                      = var.public_subnets[1]       
    availability_zone               = data.aws_availability_zones.available.names[1]
    map_public_ip_on_launch         = false
    assign_ipv6_address_on_creation = false

    tags = {
        Name = "${var.environment}_${var.project_name}_public_subnet_2"
    }
}

resource "aws_subnet" "public_3" {
    vpc_id                          = aws_vpc.main.id
    cidr_block                      = var.public_subnets[2]       
    availability_zone               = data.aws_availability_zones.available.names[2]
    map_public_ip_on_launch         = false
    assign_ipv6_address_on_creation = false

    tags = {
        Name = "${var.environment}_${var.project_name}_public_subnet_3"
    }
}

resource "aws_subnet" "private_1" {
    vpc_id                          = aws_vpc.main.id
    cidr_block                      = var.private_subnets[0]
    availability_zone               = data.aws_availability_zones.available.names[0]
    map_public_ip_on_launch         = false
    assign_ipv6_address_on_creation = false

    tags = {
        Name = "${var.environment}_${var.project_name}_private_subnet_1"
    }
}

resource "aws_subnet" "private_2" {
    vpc_id                          = aws_vpc.main.id
    cidr_block                      = var.private_subnets[1]
    availability_zone               = data.aws_availability_zones.available.names[1]
    map_public_ip_on_launch         = false
    assign_ipv6_address_on_creation = false

    tags = {
        Name = "${var.environment}_${var.project_name}_private_subnet_2"
    }
}

resource "aws_subnet" "private_3" {
    vpc_id                          = aws_vpc.main.id
    cidr_block                      = var.private_subnets[2]
    availability_zone               = data.aws_availability_zones.available.names[2]
    map_public_ip_on_launch         = false
    assign_ipv6_address_on_creation = false

    tags = {
        Name = "${var.environment}_${var.project_name}_private_subnet_3"
    }
}

resource "aws_internet_gateway" "igw" {
    vpc_id = aws_vpc.main.id
    
    tags = {
        Name = "${var.environment}_${var.project_name}_igw"
    }
}

resource "aws_eip" "nat_eip" {
    vpc         = true
    depends_on  = [aws_internet_gateway.igw]

    tags = {
        Name = "${var.environment}_${var.project_name}_igw_eip"
    }
}

resource "aws_nat_gateway" "nat" {
    allocation_id   = aws_eip.nat_eip.id
    subnet_id       = aws_subnet.public_1.id
    depends_on      = [aws_internet_gateway.igw]
    tags = {
        Name = "${var.environment}_${var.project_name}_nat"
    }
}

resource "aws_route_table" "public" {
    vpc_id = aws_vpc.main.id

    tags = {
        Name = "${var.environment}_${var.project_name}_route_table"
    }
}

resource "aws_route" "vpc_public_route" {
    route_table_id         = aws_route_table.public.id
    destination_cidr_block = "0.0.0.0/0"
    gateway_id             = aws_internet_gateway.igw.id
}

resource "aws_route_table_association" "public_1" {
    subnet_id      = aws_subnet.public_1.id
    route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_2" {
    subnet_id      = aws_subnet.public_2.id
    route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_3" {
    subnet_id      = aws_subnet.public_3.id
    route_table_id = aws_route_table.public.id
}

resource "aws_route_table" "private" {
    vpc_id = aws_vpc.main.id

    tags = {
        Name = "${var.environment}_${var.project_name}_route_table"
    }
}

resource "aws_route" "vpc_private_route" {
    route_table_id          = aws_route_table.private.id
    destination_cidr_block  = "0.0.0.0/0"
    nat_gateway_id          = aws_nat_gateway.nat.id
}

resource "aws_route_table_association" "private_1" {
    subnet_id      = aws_subnet.private_1.id
    route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "private_2" {
    subnet_id      = aws_subnet.private_2.id
    route_table_id = aws_route_table.private.id
}

resource "aws_route_table_association" "private_3" {
    subnet_id      = aws_subnet.private_3.id
    route_table_id = aws_route_table.private.id
}

# security group for serverless
resource "aws_security_group" "sls_sg" {
    name        = "sls_api_sg_dev"
    description = "Allow TLS inbound traffic"
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

# SSM
resource "aws_ssm_parameter" "vpc_id" {
    name    = "vpc_id_${var.environment}_${var.project_name}"
    type    = "String"
    value   = aws_vpc.main.id
}
resource "aws_ssm_parameter" "public_subnet_1" {
    name    = "public_subnet_1_${var.environment}_${var.project_name}"
    type    = "String"
    value   = aws_subnet.public_1.id
}
resource "aws_ssm_parameter" "public_subnet_2" {
    name    = "public_subnet_2_${var.environment}_${var.project_name}"
    type    = "String"
    value   = aws_subnet.public_2.id
}
resource "aws_ssm_parameter" "public_subnet_3" {
    name    = "public_subnet_3_${var.environment}_${var.project_name}"
    type    = "String"
    value   = aws_subnet.public_3.id
}
resource "aws_ssm_parameter" "private_subnet_1" {
    name    = "private_subnet_1_${var.environment}_${var.project_name}"
    type    = "String"
    value   = aws_subnet.private_1.id
}
resource "aws_ssm_parameter" "private_subnet_2" {
    name    = "private_subnet_2_${var.environment}_${var.project_name}"
    type    = "String"
    value   = aws_subnet.private_2.id
}
resource "aws_ssm_parameter" "private_subnet_3" {
    name    = "private_subnet_3_${var.environment}_${var.project_name}"
    type    = "String"
    value   = aws_subnet.private_3.id
}
resource "aws_ssm_parameter" "sls_sg" {
    name    = "sls_sg_${var.environment}_${var.project_name}"
    type    = "String"
    value   = aws_security_group.sls_sg.id
}
