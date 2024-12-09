resource "aws_iam_role" "ecs-task-exec-role" {
  name                = "${var.project_name}-ecs-task-exec-role-${var.environment}"
  managed_policy_arns = ["arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"]

  assume_role_policy = jsonencode({
    "Version" : "2008-10-17",
    "Statement" : [
      {
        "Sid" : "",
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "ecs-tasks.amazonaws.com"
        },
        "Action" : "sts:AssumeRole"
      }
    ]
  })
}

data "aws_iam_policy_document" "task-exec-policy" {
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "task-exec-policy" {
  name   = "${var.project_name}-task-exec-policy-${var.environment}"
  role   = aws_iam_role.ecs-task-exec-role.id
  policy = data.aws_iam_policy_document.task-exec-policy.json
}

data "aws_iam_policy_document" "ecs-task-role-policy" {
  statement {
    effect = "Allow"
    actions = [
      "sts:AssumeRole"
    ]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ecs-task-role" {
  name               = "${var.project_name}-ecs-task-role-${var.environment}"
  assume_role_policy = data.aws_iam_policy_document.ecs-task-role-policy.json
}

data "aws_iam_policy_document" "task-policy" {
  statement {
    effect = "Allow"
    actions = [
      "ssmmessages:CreateControlChannel",
      "ssmmessages:CreateDataChannel",
      "ssmmessages:OpenControlChannel",
      "ssmmessages:OpenDataChannel",
    ]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "task-policy" {
  name   = "${var.project_name}-task-policy-${var.environment}"
  role   = aws_iam_role.ecs-task-role.id
  policy = data.aws_iam_policy_document.task-policy.json
}
