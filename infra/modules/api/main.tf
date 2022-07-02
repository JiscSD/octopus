resource "random_password" "jwt_secret" {
  length  = 256
  keepers = {
    pass_version = 1
  }
}

resource "aws_ssm_parameter" "jwt_secret" {
  name  = "jwt_secret_${var.environment}_${var.project_name}"
  type  = "String"
  value = random_password.jwt_secret.result
}

resource "aws_ssm_parameter" "orcid_app_id" {
  name  = "orcid_app_id_${var.environment}_${var.project_name}"
  type  = "String"
  value = ""
  description = "The orcid api client ID, obtained from orcid, and manually updated on AWS per environment after creation through terraform."
}

resource "aws_ssm_parameter" "orcid_secret_key" {
  name  = "orcid_secret_key_${var.environment}_${var.project_name}"
  type  = "String"
  value = ""
  description = "The orcid api client secret, obtained from orcid, and manually updated on AWS per environment after creation through terraform."
}
