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

data "aws_ssm_parameter" "orcid_app_id" {
  name  = "orcid_app_id_${var.environment}_${var.project_name}"
  // Must be manually created before terraform run. It is required for API releases.
  // The orcid api client id, obtained from orcid.
}

data "aws_ssm_parameter" "orcid_secret_key" {
  name  = "orcid_secret_key_${var.environment}_${var.project_name}"
  // Must be manually created before terraform run. It is required for API releases.
  // The orcid api client secret, obtained from orcid."
}

data "aws_ssm_parameter" "doi_prefix" {
  name  = "doi_prefix_${var.environment}_${var.project_name}"
  // Must be manually created before terraform run. It is required for API releases.
  // The DOI prefix used for minting datacite DOIs.
}

data "aws_ssm_parameter" "datacite_endpoint" {
  name  = "datacite_endpoint_${var.environment}_${var.project_name}"
  // Must be manually created before terraform run. It is required for API releases.
  // The datacite endpoint used for minting DOIs.
}

data "aws_ssm_parameter" "datacite_user" {
  name  = "datacite_user_${var.environment}_${var.project_name}"
  // Must be manually created before terraform run. It is required for API releases.
  // The username of the datacite user, used for minting DOIs.
}

data "aws_ssm_parameter" "datacite_password" {
  name  = "datacite_password_${var.environment}_${var.project_name}"
  // Must be manually created before terraform run. It is required for API releases.
  // The password of the datacite user, used for minting DOIs.
}
