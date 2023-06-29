provider "aws" {
  region  = "eu-west-1"
  profile = "octopus"
}

terraform {
  required_version = ">=1.5.1"
  backend "s3" {
    bucket  = "octopus-app-tfstate"
    key     = "terraform.tfstate"
    region  = "eu-west-1"
    profile = "octopus"
  }
  required_providers {
    aws = {
      version = ">=5.5.0"
      source  = "hashicorp/aws"
    }
  }
}
