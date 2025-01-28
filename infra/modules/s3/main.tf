data "aws_caller_identity" "current" {}

locals {
  account_id = data.aws_caller_identity.current.account_id
}

resource "aws_s3_bucket" "image_bucket" {
  bucket = "science-octopus-publishing-images-${var.environment}"
}

resource "aws_s3_bucket_public_access_block" "image_bucket_allow_public" {
  bucket = aws_s3_bucket.image_bucket.id

  block_public_acls   = true
  block_public_policy = false
}

resource "aws_s3_bucket" "pdf_bucket" {
  bucket = "science-octopus-publishing-pdfs-${var.environment}"
}

resource "aws_s3_bucket_public_access_block" "pdf_bucket_allow_public" {
  bucket = aws_s3_bucket.pdf_bucket.id

  block_public_acls   = true
  block_public_policy = false
}

resource "aws_s3_bucket" "sitemap_bucket" {
  bucket = "science-octopus-publishing-sitemaps-${var.environment}"
}

resource "aws_s3_bucket_public_access_block" "sitemap_bucket_allow_public" {
  bucket = aws_s3_bucket.sitemap_bucket.id

  block_public_acls   = true
  block_public_policy = false
}

locals {
  buckets = [aws_s3_bucket.pdf_bucket, aws_s3_bucket.image_bucket, aws_s3_bucket.sitemap_bucket]
}

data "aws_iam_policy_document" "allow_public_access" {

  for_each = { for idx, bucket in local.buckets : idx => bucket }
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
  for_each = { for idx, bucket in local.buckets : idx => bucket }
  bucket   = each.value.id
  policy   = data.aws_iam_policy_document.allow_public_access[each.key].json
}

resource "aws_s3_bucket" "email_forwarding_bucket" {
  bucket = "email-forwarding-${var.environment}"
}

resource "aws_s3_bucket_public_access_block" "email_forwarding_bucket" {
  bucket = aws_s3_bucket.email_forwarding_bucket.id

  block_public_acls   = true
  block_public_policy = true
}

data "aws_iam_policy_document" "email_forwarding_bucket_policy" {
  statement {
    sid    = "AllowSESPuts"
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["ses.amazonaws.com"]
    }
    actions   = ["s3:PutObject"]
    resources = ["${aws_s3_bucket.email_forwarding_bucket.arn}/*"]
    condition {
      test     = "StringEquals"
      variable = "aws:Referer"
      values   = [local.account_id]
    }
  }
}

resource "aws_s3_bucket_policy" "email_forwarding_bucket" {
  bucket = aws_s3_bucket.email_forwarding_bucket.id
  policy = data.aws_iam_policy_document.email_forwarding_bucket_policy.json
}
