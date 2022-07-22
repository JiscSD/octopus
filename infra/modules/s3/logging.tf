
resource "aws_s3_bucket" "log_bucket" {
  bucket = "science-octopus-publishing-images-${var.environment}-logs"
}

resource "aws_s3_bucket_acl" "log_bucket_acl" {
  bucket = aws_s3_bucket.log_bucket.id
  acl    = "log-delivery-write"
}

resource "aws_s3_bucket_logging" "bucket_logging" {
  bucket = aws_s3_bucket.image_bucket.id

  target_bucket = aws_s3_bucket.log_bucket.id
  target_prefix = "log/"
}
