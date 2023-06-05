provider "aws" {
  region = "eu-west-1"
}

resource "aws_s3_bucket_acl" "my_bucket" {
  bucket = "octopus-email-bucket"
  acl    = "private"

  policy = <<EOF
{  
    "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowSESPuts",
      "Effect": "Allow",
      "Principal": {
        "Service": "ses.amazonaws.com"
      },
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::${aws_s3_bucket.my_bucket.arn}/*",
      "Condition": {
        "StringEquals": {
          "aws:Referer": "${var.aws_account_id}"
        }
      }
    }
  ]
}
EOF
}