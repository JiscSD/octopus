provider "aws" {
  region  = "eu-west-1"
  profile = "octopus"
}

terraform {
  required_version = "=1.1.9"
  backend "s3" {
    bucket  = "octopus-app-tfstate"
    key     = "terraform.tfstate"
    region  = "eu-west-1"
    profile = "octopus"
  }
  required_providers {
    aws = {
      version = "=4.12.1"
      source  = "hashicorp/aws"
    }
  }
}
