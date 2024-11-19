provider "aws" {
  region  = "eu-west-1"
  profile = var.profile
}

provider "aws" {
  alias   = "useast1"
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
