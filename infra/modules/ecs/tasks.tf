data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

locals {
  account_id  = data.aws_caller_identity.current.account_id
  region_name = data.aws_region.current.name
}

resource "aws_ecs_task_definition" "ari-import" {
  family                   = "${var.project_name}-ari-import-${var.environment}"
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
      "name" : "ari-import",
      "image" : "${local.account_id}.dkr.ecr.${local.region_name}.amazonaws.com/${var.project_name}-${var.environment}:latest",
      "entryPoints" : [
        "sh", "-c"
      ],
      "essential" : true,
      "logConfiguration" : {
        "logDriver" : "awslogs",
        "options" : {
          "awslogs-create-group" : "true",
          "awslogs-group" : "${var.project_name}-ari-import-ecs-task-${var.environment}",
          "awslogs-region" : "${local.region_name}",
          "awslogs-stream-prefix" : "ecs"
        },
        "secretOptions" : []
      },
      "environment" : [
        {
          "name" : "STAGE",
          "value" : "${var.environment}"
        }
      ],
      "secrets" : [
        {
          "name" : "DATABASE_URL",
          "valueFrom" : "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/db_connection_string_${var.environment}_${var.project_name}"
        },
        {
          "name" : "DATACITE_ENDPOINT",
          "valueFrom" : "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/datacite_endpoint_${var.environment}_${var.project_name}"
        },
        {
          "name" : "DATACITE_PASSWORD",
          "valueFrom" : "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/datacite_password_${var.environment}_${var.project_name}"
        },
        {
          "name" : "DATACITE_USER",
          "valueFrom" : "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/datacite_user_${var.environment}_${var.project_name}"
        },
        {
          "name" : "DOI_PREFIX",
          "valueFrom" : "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/doi_prefix_${var.environment}_${var.project_name}"
        },
        {
          "name" : "ELASTICSEARCH_PROTOCOL",
          "valueFrom" : "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/elastic_search_protocol_${var.environment}_${var.project_name}"
        },
        {
          "name" : "ELASTICSEARCH_USER",
          "valueFrom" : "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/elasticsearch_user_${var.environment}_${var.project_name}"
        },
        {
          "name" : "ELASTICSEARCH_PASSWORD",
          "valueFrom" : "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/elasticsearch_password_${var.environment}_${var.project_name}"
        },
        {
          "name" : "ELASTICSEARCH_ENDPOINT",
          "valueFrom" : "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/elasticsearch_endpoint_${var.environment}_${var.project_name}"
        },
        {
          "name" : "EMAIL_SENDER_ADDRESS",
          "valueFrom" : "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/email_sender_address_${var.environment}_${var.project_name}"
        },
        {
          "name" : "INGEST_REPORT_RECIPIENTS",
          "valueFrom" : "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/ingest_report_recipients_${var.environment}_${var.project_name}"
        },
        {
          "name" : "MAIL_SERVER",
          "valueFrom" : "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/mail_server_${var.environment}_${var.project_name}"
        },
        {
          "name" : "PARTICIPATING_ARI_USER_IDS",
          "valueFrom" : "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/participating_ari_user_ids_${var.environment}_${var.project_name}"
        },
        {
          "name" : "QUEUE_URL",
          "valueFrom" : "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/queue_url_${var.environment}_${var.project_name}"
        },
        {
          "name" : "SLACK_CHANNEL_EMAIL",
          "valueFrom" : "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/slack_channel_email_${var.environment}_${var.project_name}"
        },
        {
          "name" : "SQS_ENDPOINT",
          "valueFrom" : "arn:aws:ssm:${local.region_name}:${local.account_id}:parameter/sqs_endpoint_${var.environment}_${var.project_name}"
        },
      ]
    }
  ])
}

resource "aws_security_group" "ari-import-task-sg" {
  name                   = "${var.project_name}-ari-import-task-sg-${var.environment}"
  description            = "Security group for ari import ecs task"
  vpc_id                 = var.vpc_id
  revoke_rules_on_delete = true

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-ari-import-task-sg-${var.environment}"
  }
}

resource "aws_ssm_parameter" "ecs-security-group-id" {
  name  = "ecs_task_security_group_id_${var.environment}_${var.project_name}"
  type  = "String"
  value = aws_security_group.ari-import-task-sg.id
}

resource "aws_ssm_parameter" "ecs-task-definition-id" {
  name  = "ecs_task_definition_id_${var.environment}_${var.project_name}"
  type  = "String"
  value = "${aws_ecs_task_definition.ari-import.id}:${aws_ecs_task_definition.ari-import.revision}"
}
