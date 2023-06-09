variable "email_domains" {
  type    = map(list(string))
  default = {
    "rh@octopus.ac"    = ["octopus-testing-notif-aaaajiuyoqzwooajd4oh7taijy@jiscinnovate.slack.com"]
    "rp@octopus.ac"    = ["octopus-testing-notif-aaaajiuyoqzwooajd4oh7taijy@jiscinnovate.slack.com"]
    "me@octopus.ac"    = ["octopus-testing-notif-aaaajiuyoqzwooajd4oh7taijy@jiscinnovate.slack.com"]
    "re@octopus.ac"    = ["octopus-testing-notif-aaaajiuyoqzwooajd4oh7taijy@jiscinnovate.slack.com"]
    "an@octopus.ac"    = ["octopus-testing-notif-aaaajiuyoqzwooajd4oh7taijy@jiscinnovate.slack.com"]
    "in@octopus.ac"    = ["octopus-testing-notif-aaaajiuyoqzwooajd4oh7taijy@jiscinnovate.slack.com"]
    "rw@octopus.ac"    = ["octopus-testing-notif-aaaajiuyoqzwooajd4oh7taijy@jiscinnovate.slack.com"]
    "pr@octopus.ac"    = ["octopus-testing-notif-aaaajiuyoqzwooajd4oh7taijy@jiscinnovate.slack.com"]
    "hello@octopus.ac" = ["tim.fellows@jisc.ac.uk", "john.kaye@jisc.ac.uk", "inbound-hello-octopus-aaaaj2ydqccocvjmhaqopee32u@jiscinnovate.slack.com"]
  }
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
  for_each         = var.email_domains
  function_name    = "forward_mail_${each.key}"
  handler          = "index.lambda_handler"
  runtime          = "python3.8"
  filename         = "forward_mail.zip"
  source_code_hash = filebase64sha256("forward_mail.zip")
  role             = aws_iam_role.inbound_email_policy.arn
  timeout          = 30

  environment {
    variables = {
      MailS3Bucket   = "email_forwarding_bucket"
      MailS3Prefix   = var.mail_s3_prefix
      MailSender     = "octopus@octopus.ac"
      MailRecipients = join(",", each.value)
      Region         = var.region
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
      object_key_prefix = "emails/"
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
