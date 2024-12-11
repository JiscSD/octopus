data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

locals {
  account_id  = data.aws_caller_identity.current.account_id
  region_name = data.aws_region.current.name
}

resource "aws_ecs_task_definition" "hello-world" {
  family                   = "${var.project_name}-hello-world-${var.environment}"
  requires_compatibilities = ["FARGATE"]

  cpu    = 256
  memory = 512

  network_mode = "awsvpc"

  execution_role_arn = aws_iam_role.ecs-task-exec-role.arn
  task_role_arn      = aws_iam_role.ecs-task-role.arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "ARM64"
  }

  container_definitions = jsonencode([
    {
      "name" : "hello-world",
      "image" : "${local.account_id}.dkr.ecr.${local.region_name}.amazonaws.com/${var.project_name}-${var.environment}:latest",
      "entryPoints" : [
        "sh", "-c"
      ],
      "essential" : true,
      "logConfiguration" : {
        "logDriver" : "awslogs",
        "options" : {
          "awslogs-create-group" : "true",
          "awslogs-group" : "${var.project_name}-hello-world-ecs-task-${var.environment}",
          "awslogs-region" : "${local.region_name}",
          "awslogs-stream-prefix" : "ecs"
        },
        "secretOptions" : []
      }
    }
  ])
}

resource "aws_security_group" "hello-world-task-sg" {
  name                   = "${var.project_name}-hello-world-task-sg-${var.environment}"
  description            = "Security group for hello world ecs service"
  vpc_id                 = var.vpc_id
  revoke_rules_on_delete = true

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-hello-world-task-sg-${var.environment}"
  }
}

resource "aws_ssm_parameter" "ecs-security-group-id" {
  name  = "ecs_task_security_group_id_${var.environment}_${var.project_name}"
  type  = "String"
  value = aws_security_group.hello-world-task-sg.id
}

resource "aws_ssm_parameter" "ecs-task-definition-id" {
  name  = "ecs_task_definition_id_${var.environment}_${var.project_name}"
  type  = "String"
  value = "${aws_ecs_task_definition.hello-world.id}:${aws_ecs_task_definition.hello-world.revision}"
}
