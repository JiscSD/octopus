resource "aws_s3_bucket" "image_bucket" {
  bucket = "science-octopus-publishing-images-${var.environment}"
}

resource "aws_s3_bucket_public_access_block" "image_bucket" {
  bucket = aws_s3_bucket.image_bucket.id

  block_public_acls   = true
  block_public_policy = true
}

data "aws_iam_policy_document" "allow_public_access" {
  statement {
    principals {
      type        = "*"
      identifiers = ["*"]
    }

    actions = [
      "s3:GetObject"
    ]

    resources = [
      aws_s3_bucket.image_bucket.arn,
      "${aws_s3_bucket.image_bucket.id}/*",
    ]
  }
}
