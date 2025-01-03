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
  statement {
    effect = "Allow"
    actions = [
      "ssm:GetParameters"
    ]
    resources = [
      "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/datacite_endpoint_${var.environment}_${var.project_name}",
      "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/datacite_password_${var.environment}_${var.project_name}",
      "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/datacite_user_${var.environment}_${var.project_name}",
      "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/doi_prefix_${var.environment}_${var.project_name}",
      "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/db_connection_string_${var.environment}_${var.project_name}",
      "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/elastic_search_protocol_${var.environment}_${var.project_name}",
      "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/elasticsearch_user_${var.environment}_${var.project_name}",
      "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/elasticsearch_password_${var.environment}_${var.project_name}",
      "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/elasticsearch_endpoint_${var.environment}_${var.project_name}",
      "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/email_sender_address_${var.environment}_${var.project_name}",
      "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/ingest_report_recipients_${var.environment}_${var.project_name}",
      "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/mail_server_${var.environment}_${var.project_name}",
      "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/participating_ari_user_ids_${var.environment}_${var.project_name}",
      "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/queue_url_${var.environment}_${var.project_name}",
      "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/slack_channel_email_${var.environment}_${var.project_name}",
      "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/sqs_endpoint_${var.environment}_${var.project_name}"
    ]
  }
}

resource "aws_iam_role_policy" "task-exec-policy" {
  name   = "${var.project_name}-task-exec-policy-${var.environment}"
  role   = aws_iam_role.ecs-task-exec-role.id
  policy = data.aws_iam_policy_document.task-exec-policy.json
}

data "aws_iam_policy_document" "ecs-task-assume-role-policy" {
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
  assume_role_policy = data.aws_iam_policy_document.ecs-task-assume-role-policy.json
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
  statement {
    effect = "Allow"
    actions = [
      "ses:SendEmail",
      "ses:SendRawEmail"
    ]
    resources = [
      "arn:aws:ses:eu-west-1:${local.account_id}:identity/*"
    ]
  }
}

resource "aws_iam_role_policy" "task-policy" {
  name   = "${var.project_name}-task-policy-${var.environment}"
  role   = aws_iam_role.ecs-task-role.id
  policy = data.aws_iam_policy_document.task-policy.json
}
