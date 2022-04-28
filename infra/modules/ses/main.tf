resource "aws_ses_domain_identity" "octopus" {
  domain = "${var.environment}.octopus.ac"
}

resource "aws_ses_domain_dkim" "octopus" {
  domain = aws_ses_domain_identity.octopus.domain
}

resource "aws_route53_record" "octopus_verification_record" {
  zone_id = "Z0024644REA9FF3O23MK"
  name    = "_amazonses.${aws_ses_domain_identity.octopus.id}"
  type    = "TXT"
  ttl     = "600"
  records = [aws_ses_domain_identity.octopus.verification_token]
}

resource "aws_ses_domain_identity_verification" "octopus_verification" {
  domain     = aws_ses_domain_identity.octopus.id
  depends_on = [aws_route53_record.octopus_verification_record]
}

resource "aws_route53_record" "dkim_record" {
  count   = 3
  zone_id = "Z0024644REA9FF3O23MK"
  name    = "${element(aws_ses_domain_dkim.octopus.dkim_tokens, count.index)}._domainkey.${var.environment}.octopus.ac"
  type    = "CNAME"
  ttl     = "600"
  records = ["${element(aws_ses_domain_dkim.octopus.dkim_tokens, count.index)}.dkim.amazonses.com"]
}
