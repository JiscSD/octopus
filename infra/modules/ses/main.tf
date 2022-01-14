resource "aws_ses_domain_identity" "domain" {
    domain = var.environment == "prod" ? "jisc.ac.uk" : var.domain_name # Chat with nathan about the domain issue here.
}

resource "aws_ses_domain_mail_from" "example" {
    count               = var.environment == "prod" ? 1 : 0 # same as above
    domain              = aws_ses_domain_identity.domain.domain
    mail_from_domain    = var.domain_name
}

# PROD
resource "aws_route53_record" "prod_record" {
    count   = var.environment == "prod" ? 1 : 0
    zone_id = var.hosted_zone_id
    name    = "_amazonses.${aws_ses_domain_mail_from.example[0].mail_from_domain}"
    type    = "TXT"
    ttl     = "600"
    records = [aws_ses_domain_identity.domain.verification_token]
}

resource "aws_ses_domain_identity_verification" "domain_verification_prod" {
    count       = var.environment == "prod" ? 1 : 0
    domain      = aws_ses_domain_identity.domain.id
    depends_on  = [aws_route53_record.prod_record]
}

# DEV
resource "aws_route53_record" "dev_record" {
    count   = var.environment == "prod" ? 0 : 1
    zone_id = var.hosted_zone_id
    name    = "_amazonses.${aws_ses_domain_identity.domain.id}"
    type    = "TXT"
    ttl     = "600"
    records = [aws_ses_domain_identity.domain.verification_token]
}

resource "aws_ses_domain_identity_verification" "domain_verification_dev" {
    count       = var.environment == "prod" ? 0 : 1
    domain      = aws_ses_domain_identity.domain.id
    depends_on  = [aws_route53_record.dev_record]
}
