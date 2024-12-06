resource "aws_s3_bucket" "codepipeline_bucket" {
  bucket = "${var.project_name}-codepipeline-bucket-${var.environment}"
  tags = {
    Name = "${var.project_name}-codepipeline-bucket-${var.environment}"
  }
}

resource "aws_s3_bucket_ownership_controls" "codepipeline_bucket_ownership_controls" {
  bucket = aws_s3_bucket.codepipeline_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "codepipeline_bucket_acl" {
  depends_on = [aws_s3_bucket_ownership_controls.codepipeline_bucket_ownership_controls]

  bucket = aws_s3_bucket.codepipeline_bucket.id
  acl    = "private"
}

resource "aws_s3_bucket_public_access_block" "codepipeline_bucket_access" {
  bucket                  = aws_s3_bucket.codepipeline_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  restrict_public_buckets = true
  ignore_public_acls      = true
}
