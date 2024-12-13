provider "aws" {
  region  = "eu-west-1"
  profile = var.profile
  # Jisc tagging policy - tags must be in PascalCase.
  default_tags {
    tags = {
      Application = "Octopus"
      Compliance  = "CE"
      CostCentre  = "P10031"
      Environment = title(terraform.workspace)
      Owner       = "OctopusTeam"
      Product     = "Octopus"
    }
  }
}

# Some resources need to be created in the "global" us-east-1 region.
# This aliased provider allows us to use a different region on a per-resource basis.
provider "aws" {
  alias   = "us-east-1-provider"
  region  = "us-east-1"
  profile = var.profile
}

terraform {
  required_version = ">=1.5.1"
  backend "s3" {
    bucket  = "octopus-tfstate"
    key     = "terraform.tfstate"
    region  = "eu-west-1"
    profile = "octopus-tfstate"
  }
  required_providers {
    aws = {
      version = ">=5.5.0"
      source  = "hashicorp/aws"
    }
  }
}
