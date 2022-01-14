resource "aws_s3_bucket" "bucket" {
  bucket = "${var.project_name}-app-storage"
  # private
  # public-read
  # public-read-write
  # aws-exec-read
  # authenticated-read
  # log-delivery-write
  acl = var.acl

  tags = {
    Name        = "${var.environment}_${var.project_name}_storage"
    Environment = var.environment
  }
}

// https://bucketname.s3.eu-west-1.amazonaws.com/int/

/**

/int/publications/user/

/prod/publications


*/
