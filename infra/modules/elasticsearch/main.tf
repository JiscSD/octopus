data "aws_caller_identity" "current" {}

resource "random_string" "db_master_pass" {
  length           = 40
  special          = true
  min_numeric      = 1
  min_lower        = 1
  min_upper        = 1
  min_special      = 1
  override_special = ".-_!"

  keepers = {
    pass_version = 1
  }
}

# resource "aws_iam_service_linked_role" "elasticsearch" {
#   aws_service_name = "es.amazonaws.com"
# }

resource "aws_security_group" "elasticsearch" {
  name   = "${var.environment}-elasticsearch-sg"
  vpc_id = var.vpc_id

  ingress {
    from_port = 443
    to_port   = 443
    protocol  = "tcp"

    cidr_blocks = ["10.0.0.0/16"]
  }
}

resource "aws_elasticsearch_domain" "elasticsearch" {
  domain_name           = "${var.environment}-octopus"
  elasticsearch_version = "OpenSearch_2.7"

  encrypt_at_rest {
    enabled = true
  }

  node_to_node_encryption {
    enabled = true
  }

  ebs_options {
    ebs_enabled = true
    volume_size = 10
  }

  domain_endpoint_options {
    enforce_https       = true
    tls_security_policy = "Policy-Min-TLS-1-0-2019-07"
  }

  cluster_config {
    instance_type          = var.instance_size
    instance_count         = 3
    zone_awareness_enabled = true

    zone_awareness_config {
      availability_zone_count = 3
    }
  }

  vpc_options {
    subnet_ids         = var.private_subnet_ids
    security_group_ids = [aws_security_group.elasticsearch.id]
  }

  advanced_options = {
    "rest.action.multi.allow_explicit_index" = "true"
    "override_main_response_version"         = "true"
  }

  advanced_security_options {
    enabled                        = true
    internal_user_database_enabled = true

    master_user_options {
      master_user_name     = "octopus_admin"
      master_user_password = random_string.db_master_pass.result
    }
  }

  access_policies = <<CONFIG
  {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "es:*",
            "Principal": "*",
            "Effect": "Allow",
            "Resource": "arn:aws:es:eu-west-1:948306873545:domain/${var.environment}-octopus/*"
        }
    ]
  }
  CONFIG

#   depends_on = [
#     aws_iam_service_linked_role.elasticsearch
#   ]

}

// Save password to SSM
resource "aws_ssm_parameter" "elasticsearch_domain" {
  name      = "elasticsearch_domain_${var.environment}_octopus"
  type      = "String"
  value     = aws_elasticsearch_domain.elasticsearch.domain_name
  overwrite = true

}

resource "aws_ssm_parameter" "elasticsearch_endpoint" {
  name      = "elasticsearch_endpoint_${var.environment}_octopus"
  type      = "String"
  value     = aws_elasticsearch_domain.elasticsearch.endpoint
  overwrite = true

}

resource "aws_ssm_parameter" "elasticsearch_user" {
  name      = "elasticsearch_user_${var.environment}_octopus"
  type      = "String"
  value     = "octopus_admin"
  overwrite = true
}

resource "aws_ssm_parameter" "elasticsearch_password" {
  name      = "elasticsearch_password_${var.environment}_octopus"
  type      = "String"
  value     = random_string.db_master_pass.result
  overwrite = true
}
