resource "aws_security_group" "ec2_sg" {
  name    = "ec2-sg"
  vpc_id  = var.vpc_id

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

data "template_file" "install_software" {
  template = file("${path.module}/scripts/install-bastion-software.yaml")
}

data "aws_ami" "amazon-linux-2023" {
  most_recent = true

  filter {
    name   = "owner-alias"
    values = ["amazon"]
  }

  filter {
    name   = "name"
    values = ["al2023-ami-2023*"]
  }
}

resource "aws_instance" "bastion" {
  ami                         = "${data.aws_ami.amazon-linux-2023.id}"
  instance_type               = "t3.nano"
  subnet_id                   = var.public_subnet
  vpc_security_group_ids      = [aws_security_group.ec2_sg.id]
  associate_public_ip_address = true
  user_data                   = data.template_file.install_software.rendered
  iam_instance_profile        = aws_iam_instance_profile.allow_ssm_iam_profile.name
  
  tags = {
    Name        = "bastion_${var.environment}"
    Environment = var.environment
    "GIIT:Schedule:Daily:Enable" = "TRUE"
    "GIIT:Schedule:Daily:TheSchedule" =	"mon,tue,wed,thu,fri;0830;mon,tue,wed,thu,fri;1800;"
  }
}

