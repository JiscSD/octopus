resource "aws_iam_role" "ec2_iam_role" {
    name                = local.ec2_iam_role_name
    assume_role_policy  = <<EOF
{
    "Version": "2008-10-17",
    "Statement": [
        {
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
                "Service": [
                    "ec2.amazonaws.com"
                ]
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
EOF
}

resource "aws_iam_policy" "ec2_instance_policy" {
    name        = "ec2_instances_policy_${var.environment}"
    description = "ec2_instance_policy"

    // example: https://github.com/awsdocs/amazon-ecs-developer-guide/blob/master/doc_source/instance_IAM_role.md
    // AmazonEC2ContainerServiceforEC2Role, AmazonS3FullAccess, ElasticLoadBalancingFullAccess
    policy      = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ecs:*",
                "ec2:*",
                "elasticloadbalancing:*",
                "ecr:*",
                "cloudwatch:*",
                "s3:*",
                "rds:*",
                "logs:*"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "ec2_role_policy_attachment" {
    role       = aws_iam_role.ec2_iam_role.name
    policy_arn = aws_iam_policy.ec2_instance_policy.arn
}


resource "aws_iam_instance_profile" "ec2_iam_role_profile" {
    name = local.ec2_iam_role_name
    role = aws_iam_role.ec2_iam_role.name
}

resource "aws_iam_role" "task_definition_role" {
    name                = "task_definition_role_${var.environment}"
    assume_role_policy  = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
                "Service": "ecs-tasks.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
EOF
}

resource "aws_iam_policy" "task_definition_role_policy" {
    name        = "task_definition_role_policy_${var.environment}"
    description = "task_definition_role_policy"
    policy      = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "secretsmanager:GetSecretValue",
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "s3:*"
            ],
        "Effect": "Allow",
        "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "task_definition_role_policy_attachment" {
    role       = aws_iam_role.task_definition_role.name
    policy_arn = aws_iam_policy.task_definition_role_policy.arn
}

resource "aws_security_group" "ec2_instance_security_group" {
    name        = "ec2_instance_security_group_${var.environment}"
    description = "Control access to the EC2 instances"
    vpc_id      = var.vpc_id

    ingress {
        from_port       = 49153
        to_port         = 65535
        protocol        = "tcp"
        cidr_blocks     = var.public_subnet_cidr
        // only allow access from the application load balancer security group
        security_groups = [aws_security_group.alb_security_group.id]
    }

    ingress {
        from_port       = 32768
        to_port         = 61000
        protocol        = "tcp"
        cidr_blocks     = var.public_subnet_cidr
        // only allow access from the application load balancer security group
        security_groups = [aws_security_group.alb_security_group.id]
    }

    // responding to the wider internet, but only within routes inside of the public subnet
    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

// security group for application load balancer
resource "aws_security_group" "alb_security_group" {
    name        = "alb_security_group_${var.environment}"
    description = "Control access to the application load balancer"
    vpc_id      = var.vpc_id

    ingress {
        from_port   = 80
        to_port     = 80
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        from_port       = 80
        to_port         = 80
        protocol        = "tcp"
        cidr_blocks     = var.public_subnet_cidr
    }

    ingress {
        from_port   = 443
        to_port     = 443
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        from_port       = 443
        to_port         = 443
        protocol        = "tcp"
        cidr_blocks     = var.public_subnet_cidr
    }
}

data "template_file" "cluster_user_data" {
    template = file("${path.module}/user_data.tpl")

    vars = {
        cluster_name = local.cluster_full_name
    }
}

resource "aws_launch_configuration" "ecs_launch_config" {
    image_id                    = "ami-096dbf55319e44970"
    name_prefix                 = "launch-config-${var.environment}-"
    iam_instance_profile        = aws_iam_instance_profile.ec2_iam_role_profile.name

    user_data                   = data.template_file.cluster_user_data.rendered

    security_groups             = [aws_security_group.ec2_instance_security_group.id]
    instance_type               = var.instance_type
    key_name                    = aws_key_pair.ecs_instance_ssh_key_pair.key_name
    associate_public_ip_address = true

    lifecycle {
        create_before_destroy = true
    }
}