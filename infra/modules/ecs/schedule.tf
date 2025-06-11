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
        Resource = ["${trimsuffix(aws_ecs_task_definition.script-runner.arn, ":${aws_ecs_task_definition.script-runner.revision}")}:*"]
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

resource "aws_scheduler_schedule" "ari_import_cron" {
  name = "ari-import-schedule-${var.environment}-${var.project_name}"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression = "cron(0 5 ? * TUE *)" # Run every Tuesday at 5AM

  target {
    arn      = aws_ecs_cluster.ecs.arn
    role_arn = aws_iam_role.scheduler.arn

    # On prod, override container command to do a dry run instead of a real one.
    # The output will be checked before manually triggering a real run using the API.
    input = jsonencode({
      containerOverrides = [
        {
          command = terraform.workspace == "prod" ? ["npm", "run", "ariImport", "--", "dryRun=true", "reportFormat=email"] : ["npm", "run", "ariImport", "--", "reportFormat=email"]
          name    = "ari-import"
        }
      ]
    })

    dead_letter_config {
      arn = aws_sqs_queue.scheduler-dlq.arn
    }

    ecs_parameters {
      # Trimming the revision suffix here so that schedule always uses latest revision
      task_definition_arn = trimsuffix(aws_ecs_task_definition.script-runner.arn, ":${aws_ecs_task_definition.script-runner.revision}")
      launch_type         = "FARGATE"

      network_configuration {
        security_groups = [aws_security_group.script-runner-task-sg.id]
        subnets         = var.private_subnet_ids
      }
    }
  }
}

resource "aws_sqs_queue" "scheduler-dlq" {
  name = "scheduler-dlq-${var.environment}-${var.project_name}"
}
