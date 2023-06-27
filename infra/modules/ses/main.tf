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


resource "aws_iam_policy" "inbound_email_policy" {
  name        = "inbound_email_policy"
  description = "IAM policy for managing inbound emails"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogStream",
        "logs:CreateLogGroup",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    },
    {
      "Sid": "VisualEditor1",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "ses:SendRawEmail"
      ],
      "Resource": [
        "arn:aws:s3:::octopus-email-bucket/*",
        "arn:aws:ses:eu-west-1:${var.aws_account_id}:identity/*"
      ]
    }
  ]
}
EOF
}

resource "aws_lambda_function" "forward_mail" {
  for_each         = var.email_addresses
  function_name    = "forward_mail_${var.environment}_${each.key}"
  handler          = "index.lambda_handler"
  runtime          = "python3.8"
  filename         = "forward_mail.zip"
  source_code_hash = filebase64sha256("forward_mail.zip")
  role             = aws_iam_role.inbound_email_policy.arn
  timeout          = 30

  environment {
    variables = {
      MailS3Bucket   = "email_forwarding_bucket"
      MailS3Prefix   = "email/${env.environment}/${each.key}"
      MailSender     = "octopus@octopus.ac"
      MailRecipients = join(",", each.value)
      Region         = aws.region
    }
  }
}

resource "aws_ses_receipt_rule" "s3_action_rule" {
  for_each     = var.email_domains
  rule_set_name = aws_ses_receipt_rule_set.example.rule_set_name
  rule_name     = "s3-action-rule-${each.key}"
  enabled       = true

  actions {
    s3_action {
      bucket_name       = "email_forwarding_bucket"
      object_key_prefix = "email/${env.environment}/${each.key}"
    }
  }

  recipients = [each.key]
}

resource "aws_ses_receipt_rule" "lambda_action_rule" {
  for_each     = var.email_domains
  rule_set_name = aws_ses_receipt_rule_set.example.rule_set_name
  rule_name     = "lambda-action-rule-${each.key}"
  enabled       = true

  actions {
    lambda_action {
      function_arn     = aws_lambda_function.forward_mail[each.key].arn
      invocation_type = "Event"
    }
  }

  recipients = [each.key]
}
