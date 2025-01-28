data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

locals {
  account_id  = data.aws_caller_identity.current.account_id
  region_name = data.aws_region.current.name
}

resource "aws_codebuild_project" "deploy-docker-image" {
  name          = "${var.project_name}-codebuild-deploy-docker-image-${var.environment}"
  description   = "Build docker image"
  build_timeout = "300"
  service_role  = aws_iam_role.codepipeline_role.arn

  artifacts {
    type = "CODEPIPELINE"
  }

  environment {
    compute_type    = "BUILD_GENERAL1_SMALL"
    image           = "aws/codebuild/amazonlinux-aarch64-standard:3.0"
    type            = "ARM_CONTAINER"
    privileged_mode = true

    environment_variable {
      name  = "ACCOUNT_ID"
      value = local.account_id
    }

    environment_variable {
      name  = "DEFAULT_REGION"
      value = local.region_name
    }

    environment_variable {
      name  = "IMAGE_NAME"
      value = "latest"
    }

    environment_variable {
      name  = "COMMIT_ID"
      value = "#{SourceVariables.CommitId}"
    }

    environment_variable {
      name  = "PROJECT_NAME"
      value = var.project_name
    }

    environment_variable {
      name  = "ENVIRONMENT"
      value = var.environment
    }
  }

  source_version = var.environment

  source {
    type      = "CODEPIPELINE"
    buildspec = "infra/modules/codepipeline/buildspec/deploy-docker-image.yml"
  }
}
