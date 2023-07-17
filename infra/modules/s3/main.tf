data "aws_caller_identity" "current" {}

data "aws_region" "default" {}

locals {
    account_id = data.aws_caller_identity.current.account_id
}


resource "aws_s3_bucket" "image_bucket" {
  bucket = "science-octopus-publishing-images-${var.environment}"
}

resource "aws_s3_bucket_public_access_block" "image_bucket" {
  bucket = aws_s3_bucket.image_bucket.id

  block_public_acls   = true
  block_public_policy = true
}

resource "aws_s3_bucket" "pdf_bucket" {
  bucket = "science-octopus-publishing-pdfs-${var.environment}"
}

locals {
  buckets = [aws_s3_bucket.pdf_bucket, aws_s3_bucket.image_bucket]
}

data "aws_iam_policy_document" "allow_public_access" {
  
  for_each = {for idx, bucket in local.buckets: idx => bucket}
  statement {
    principals {
      type        = "*"
      identifiers = ["*"]
    }

    actions = [
      "s3:GetObject"
    ]

    resources = [
      "${each.value.arn}/*",
    ]
  }
}

resource "aws_s3_bucket_policy" "allow_public_access" {
  for_each = {for idx, bucket in local.buckets: idx => bucket}
  bucket = each.value.id
  policy = data.aws_iam_policy_document.allow_public_access[each.key].json
}


resource "aws_lambda_function" "pdf_processing_lambda" {
  filename      = "${path.module}/pdf-processing-lambda.zip"
  function_name = "${var.environment}-pdf-processing-lambda"
  role          = aws_iam_role.pdf_processing_lambda_role.arn
  handler       = "lambda_function.lambda_handler"
  runtime       = "nodejs18.x"
  source_code_hash = filebase64sha256("${path.module}/pdf-processing-lambda.zip")

  environment {
    variables = {
      EMAIL_RECIPIENT        = var.pub_router_failure_channel
      PUBROUTER_API_KEY       = var.pub_router_api_key
      ENVIRONMENT          = var.environment
    }
  }
}

resource "aws_iam_role" "pdf_processing_lambda_role" {
  name = "pdf_processing_lambda_role"

  assume_role_policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "",
        "Effect": "Allow",
        "Principal": {
          "Service": "lambda.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  })
}


resource "aws_s3_bucket" "email_forwarding_bucket" {
  bucket = "email-forwarding-${var.environment}"
}

resource "aws_s3_bucket_public_access_block" "email_forwarding_bucket" {
  bucket = aws_s3_bucket.email_forwarding_bucket.id

  block_public_acls   = true
  block_public_policy = true
}


resource "aws_s3_bucket_policy" "email_forwarding_bucket" {
  bucket = aws_s3_bucket.email_forwarding_bucket.id

  policy = <<EOF
{  
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "s3:PutObject",
      "Resource": "${aws_s3_bucket.email_forwarding_bucket.arn}/*",
      "Condition": {
        "StringEquals": {
          "aws:Referer": "${local.account_id}"
        }        
      }
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "pdf_processing_lambda_s3_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
  role       = aws_iam_role.pdf_processing_lambda_role.name
}

resource "aws_iam_role_policy_attachment" "pdf_processing_lambda_ses_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonSESFullAccess"
  role       = aws_iam_role.pdf_processing_lambda_role.name
}

resource "aws_iam_role_policy_attachment" "pdf_processing_lambda_cloudwatch_logs_policy" {
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
  role       = aws_iam_role.pdf_processing_lambda_role.name
}

resource "aws_s3_bucket_notification" "bucket_notification" {
  bucket = aws_s3_bucket.pdf_bucket.id

  lambda_function {
    lambda_function_arn = aws_lambda_function.pdf_processing_lambda.arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "AWSLogs/"
    filter_suffix       = ".log"
  }

  depends_on = [aws_lambda_permission.s3_trigger_permission]
}

resource "aws_lambda_permission" "s3_trigger_permission" {
  statement_id  = "AllowS3Invocation"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.pdf_processing_lambda.arn
  principal     = "s3.amazonaws.com"

  source_arn = aws_s3_bucket.pdf_bucket.arn
}
