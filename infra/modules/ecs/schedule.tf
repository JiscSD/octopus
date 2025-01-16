locals {
  only_on_int_mapping = {
    int  = 1
    prod = 0
  }
  only_on_int = local.only_on_int_mapping[terraform.workspace]
  only_on_prod_mapping = {
    int  = 0
    prod = 1
  }
  only_on_prod = local.only_on_prod_mapping[terraform.workspace]
}

# Code adapted from https://medium.com/@igorkachmaryk/using-terraform-to-setup-aws-eventbridge-scheduler-and-a-scheduled-ecs-task-1208ae077360

resource "aws_iam_role" "scheduler" {
  name = "cron-scheduler-role-${var.environment}-${var.project_name}"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = ["scheduler.amazonaws.com"]
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "scheduler" {
  policy_arn = aws_iam_policy.scheduler.arn
  role       = aws_iam_role.scheduler.name
}

resource "aws_iam_policy" "scheduler" {
  name = "cron-scheduler-policy-${var.environment}-${var.project_name}"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "ecs:RunTask"
        ]
        # Replace revision number with *
        Resource = ["${trimsuffix(aws_ecs_task_definition.ari-import.arn, ":${aws_ecs_task_definition.ari-import.revision}")}:*"]
      },
      {
        Effect = "Allow",
        Action = [
          "iam:PassRole"
        ]
        Resource = [aws_iam_role.ecs-task-role.arn, aws_iam_role.ecs-task-exec-role.arn]
      },
      {
        Action = [
          "sqs:SendMessage"
        ],
        Effect   = "Allow",
        Resource = [aws_sqs_queue.scheduler-dlq.arn]
      }
    ]
  })
}

resource "aws_scheduler_schedule" "int_ari_import_cron" {
  count = local.only_on_int
  name  = "ari-import-schedule-int"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression = "cron(0 5 ? * TUE *)" # Run every Tuesday at 5AM

  target {
    arn      = aws_ecs_cluster.ecs.arn
    role_arn = aws_iam_role.scheduler.arn

    input = jsonencode({
      containerOverrides = [
        {
          command = ["npm", "run", "ariImport", "--", "dryRun=true", "reportFormat=email"]
          name    = "ari-import"
        }
      ]
    })

    dead_letter_config {
      arn = aws_sqs_queue.scheduler-dlq.arn
    }

    ecs_parameters {
      # Trimming the revision suffix here so that schedule always uses latest revision
      task_definition_arn = trimsuffix(aws_ecs_task_definition.ari-import.arn, ":${aws_ecs_task_definition.ari-import.revision}")
      launch_type         = "FARGATE"

      network_configuration {
        security_groups = [aws_security_group.ari-import-task-sg.id]
        subnets         = var.private_subnet_ids
      }
    }
  }
}

# This should be the same as the int schedule, but override the container command to do a dry run,
# and only be deployed to prod (using the count attribute)
resource "aws_scheduler_schedule" "prod_ari_import_cron" {
  count = local.only_on_prod
  name  = "ari-import-schedule-prod"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression = "cron(0 5 ? * TUE *)" # Run every Tuesday at 5AM

  target {
    arn      = aws_ecs_cluster.ecs.arn
    role_arn = aws_iam_role.scheduler.arn

    input = jsonencode({
      containerOverrides = [
        {
          command = ["npm", "run", "ariImport", "--", "dryRun=true", "reportFormat=email"]
          name    = "ari-import"
        }
      ]
    })

    ecs_parameters {
      # Trimming the revision suffix here so that schedule always uses latest revision
      task_definition_arn = trimsuffix(aws_ecs_task_definition.ari-import.arn, ":${aws_ecs_task_definition.ari-import.revision}")
      launch_type         = "FARGATE"

      network_configuration {
        security_groups = [aws_security_group.ari-import-task-sg.id]
        subnets         = var.private_subnet_ids
      }
    }
  }
}

resource "aws_sqs_queue" "scheduler-dlq" {
  name = "scheduler-dlq-${var.environment}-${var.project_name}"
}
