provider "aws" {
    region  = "eu-west-1"
    profile = "octopus"
}

terraform {
    required_version = "=0.14.6"
    backend "s3" {
        bucket                  = "octopus-app-tfstate"
        key                     = "cicd/terraform.tfstate"
        region                  = "eu-west-1"
        profile                 = "octopus"
    }
    required_providers {
        aws = {
            version = ">= 2.7.0"
            source = "hashicorp/aws"
        }
    }
}
