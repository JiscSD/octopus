data "aws_caller_identity" "current" {}

data "aws_region" "default" {}

data "aws_ssm_parameter" "email_addresses" {
  name = "email_addresses_${var.environment}_${var.project_name}"
}

locals {
  account_id        = data.aws_caller_identity.current.account_id
  email_address_map = jsondecode(data.aws_ssm_parameter.email_addresses.value)
}


resource "aws_ses_domain_identity" "octopus" {
  domain = "${var.environment}.octopus.ac"
}

resource "aws_ses_domain_dkim" "octopus" {
  domain = aws_ses_domain_identity.octopus.domain
}

resource "aws_route53_record" "octopus_verification_record" {
  zone_id = "Z0024644REA9FF3O23MK"
  name    = "_amazonses.${aws_ses_domain_identity.octopus.id}"
  type    = "TXT"
  ttl     = "600"
  records = [aws_ses_domain_identity.octopus.verification_token]
}

resource "aws_ses_domain_identity_verification" "octopus_verification" {
  domain     = aws_ses_domain_identity.octopus.id
  depends_on = [aws_route53_record.octopus_verification_record]
}

resource "aws_route53_record" "dkim_record" {
  count   = 3
  zone_id = "Z0024644REA9FF3O23MK"
  name    = "${element(aws_ses_domain_dkim.octopus.dkim_tokens, count.index)}._domainkey.${var.environment}.octopus.ac"
  type    = "CNAME"
  ttl     = "600"
  records = ["${element(aws_ses_domain_dkim.octopus.dkim_tokens, count.index)}.dkim.amazonses.com"]
}

resource "aws_iam_role" "inbound_email_role" {
  name        = "inbound_email_role-${var.environment}"
  description = "IAM role for managing inbound emails"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      },
    ]
  })

  inline_policy {
    name = "inbound_email_role_policy"
    policy = jsonencode({
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Sid" : "VisualEditor0",
          "Effect" : "Allow",
          "Action" : [
            "logs:CreateLogStream",
            "logs:CreateLogGroup",
            "logs:PutLogEvents"
          ],
          "Resource" : "*"
        },
        {
          "Sid" : "VisualEditor1",
          "Effect" : "Allow",
          "Action" : [
            "s3:GetObject",
            "ses:SendRawEmail"
          ],
          "Resource" : [
            "arn:aws:s3:::email-forwarding-${var.environment}/*",
            "arn:aws:ses:eu-west-1:${local.account_id}:identity/*"
          ]
        }
      ]
    })
  }
}


resource "aws_lambda_permission" "ses" {
  count         = length(keys(local.email_address_map))
  statement_id  = aws_lambda_function.forward_mail[count.index].function_name
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.forward_mail[count.index].function_name
  principal     = "ses.amazonaws.com"
  source_arn    = "arn:aws:ses:eu-west-1:${local.account_id}:receipt-rule-set/forward-${var.environment}-emails:receipt-rule/action-rule-${replace(nonsensitive(element(keys(local.email_address_map), count.index)), "/@|\\./", "-")}"
}


resource "aws_lambda_function" "forward_mail" {
  count            = length(keys(local.email_address_map))
  function_name    = "mail-${var.environment}-${replace(nonsensitive(element(keys(local.email_address_map), count.index)), "/@|\\./", "-")}"
  handler          = "lambda_function.lambda_handler"
  runtime          = "python3.12"
  filename         = "${path.module}/forward-mail.zip"
  source_code_hash = filebase64sha256("${path.module}/forward-mail.zip")
  role             = aws_iam_role.inbound_email_role.arn
  timeout          = 30

  environment {
    variables = {
      MailS3Bucket  = "email-forwarding-${var.environment}"
      MailS3Prefix  = "email/${nonsensitive(element(keys(local.email_address_map), count.index))}"
      MailSender    = "octopus@mail.octopus.ac"
      MailRecipient = join(",", local.email_address_map[element(keys(local.email_address_map), count.index)])
      Region        = data.aws_region.default.name
    }
  }
}

resource "aws_ses_receipt_rule_set" "main" {
  rule_set_name = "forward-${var.environment}-emails"
}

resource "aws_ses_receipt_rule" "action_rule" {
  depends_on = [aws_lambda_permission.ses]
  count      = length(keys(local.email_address_map))

  rule_set_name = aws_ses_receipt_rule_set.main.rule_set_name
  name          = "action-rule-${replace(nonsensitive(element(keys(local.email_address_map), count.index)), "/@|\\./", "-")}"
  enabled       = true

  s3_action {
    bucket_name       = "email-forwarding-${var.environment}"
    object_key_prefix = "email/${nonsensitive(element(keys(local.email_address_map), count.index))}"
    position          = 1
  }

  lambda_action {
    function_arn    = aws_lambda_function.forward_mail[count.index].arn
    invocation_type = "Event"
    position        = 2
  }

  recipients = [nonsensitive(element(keys(local.email_address_map), count.index))]
}
