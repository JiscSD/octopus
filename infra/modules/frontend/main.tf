resource "aws_security_group" "elb" {
  name   = "elb-sg-${var.environment}"
  vpc_id = var.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 80
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_elb" "frontend_lb" {
  name            = "frontend-lb-${var.environment}"
  security_groups = [aws_security_group.elb.id]
  subnets         = var.public_subnets

  listener {
    instance_port      = 3000
    instance_protocol  = "http"
    lb_port            = 443
    lb_protocol        = "https"
    ssl_certificate_id = "arn:aws:acm:eu-west-1:948306873545:certificate/c042c6d2-ac69-4369-b73e-2bc828a36925"
  }

  health_check {
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 3
    target              = "HTTP:3000/"
    interval            = 30
  }

  instances                   = [aws_instance.bastion.id]
  cross_zone_load_balancing   = true
  idle_timeout                = 400
  connection_draining         = true
  connection_draining_timeout = 400

  tags = {
    Name = "foobar-terraform-elb"
  }
}

resource "aws_route53_record" "domain" {
  zone_id = "Z0024644REA9FF3O23MK"
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_elb.frontend_lb.dns_name
    zone_id                = aws_elb.frontend_lb.zone_id
    evaluate_target_health = true
  }
}

resource "aws_security_group" "ec2_frontend_sg" {
  name   = "ec2-frontend-sg-${var.environment}"
  vpc_id = var.vpc_id

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

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
  instance_type               = "t3.medium"
  subnet_id                   = var.public_subnet
  vpc_security_group_ids      = [aws_security_group.ec2_frontend_sg.id]
  key_name                    = var.ec2_key_name
  associate_public_ip_address = true

  tags = {
    Name        = "frontend_ec2_${var.environment}"
    Environment = var.environment
  }
}
