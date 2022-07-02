resource "aws_security_group" "ec2_sg" {
    name    = "ec2-sg"
    vpc_id  = var.vpc_id

    ingress {
        from_port   = 22
        to_port     = 22
        protocol    = "tcp"
        cidr_blocks = var.allowable_ips
    }

    egress {
        from_port   = 0
        to_port     = 0
        cidr_blocks = ["0.0.0.0/0"]
        protocol    = "-1"
    }

    tags = {
        Name        = "bastion_sg_${var.environment}"
        Environment = var.environment
    }
}

resource "aws_instance" "bastion" {
    ami                         = "ami-0bb3fad3c0286ebd5"
    instance_type               = "t2.small"
    subnet_id                   = var.public_subnet
    vpc_security_group_ids      = [aws_security_group.ec2_sg.id]
    key_name                    = var.ec2_key_name
    associate_public_ip_address = true
    
    tags = {
        Name        = "bastion_${var.environment}"
        Environment = var.environment
    }
}
