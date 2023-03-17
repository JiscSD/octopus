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
  policy = data.aws_iam_policy_document.allow_public_access.json
}
