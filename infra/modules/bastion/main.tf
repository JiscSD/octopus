resource "aws_eip" "elastic_ip" {
  domain = "vpc"
  tags   =  {
    Name = "bastion_${var.environment}"
  }
}

resource "aws_eip_association" "eip_assoc" {
  instance_id   = aws_instance.bastion.id
  allocation_id = aws_eip.elastic_ip.id
}

resource "aws_security_group" "ec2_sg" {
    name    = "ec2-sg"
    vpc_id  = var.vpc_id

    ingress {
        from_port   = 22
        to_port     = 22
        protocol    = "tcp"
        cidr_blocks = var.allowable_ips
        description = ""
    }

    ingress {
        from_port   = 22
        to_port     = 22
        protocol    = "tcp"
        cidr_blocks = var.third_party_vpn_ips
        description = "openvpn3rd.jisc.ac.uk"
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

resource "aws_iam_role" "allow_ssm_role" {
  name               = "ssm-role"
  description        = "Allow SSM access to EC2"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": {
    "Effect": "Allow",
    "Principal": {"Service": "ec2.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }
}
EOF
}

resource "aws_iam_instance_profile" "allow_ssm_iam_profile" {
  name = "ec2_profile"
  role = aws_iam_role.allow_ssm_role.name
}

resource "aws_iam_role_policy_attachment" "allow_ssm_iam_policy" {
  role       = aws_iam_role.allow_ssm_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

data "template_file" "user_data" {
  template = file("./scripts/install-bastion-software.yaml")
}

resource "aws_instance" "bastion" {
    ami                         = "ami-0bb3fad3c0286ebd5"
    instance_type               = "t3.nano"
    subnet_id                   = var.public_subnet
    vpc_security_group_ids      = [aws_security_group.ec2_sg.id]
    key_name                    = var.ec2_key_name
    associate_public_ip_address = true
    user_data                   = data.template_file.user_data.rendered
    iam_instance_profile        = aws_iam_instance_profile.allow_ssm_iam_profile.name
    
    tags = {
        Name        = "bastion_${var.environment}"
        Environment = var.environment
        "GIIT:Schedule:Daily:Enable" = "TRUE"
        "GIIT:Schedule:Daily:TheSchedule" =	"mon,tue,wed,thu,fri;0830;mon,tue,wed,thu,fri;1800;"
    }
}

