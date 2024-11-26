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
    cpu_architecture        = "X86_64"
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
