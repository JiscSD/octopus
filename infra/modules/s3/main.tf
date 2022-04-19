resource "aws_s3_bucket" "image_bucket" {
  bucket = "science-octopus-publishing-images-${var.environment}"
  acl    = "public-read"
}
