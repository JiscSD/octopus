data "aws_ssm_parameter" "github_codestar_connection_arn" {
  name = "${var.project_name}_github_codestar_connection_arn"
}

resource "aws_codepipeline" "script-runner-docker-image-codepipeline" {
  name          = "${var.project_name}-script-runner-docker-image-pipeline-${var.environment}"
  role_arn      = aws_iam_role.codepipeline_role.arn
  pipeline_type = "V2"

  artifact_store {
    type     = "S3"
    location = aws_s3_bucket.codepipeline_bucket.bucket
  }

  stage {
    name = "Source"

    action {
      name             = "Source"
      category         = "Source"
      owner            = "AWS"
      provider         = "CodeStarSourceConnection"
      version          = "1"
      output_artifacts = ["source_output"]
      namespace        = "SourceVariables"

      // options given here: https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-CodestarConnectionSource.html#action-reference-CodestarConnectionSource-config
      configuration = {
        ConnectionArn        = data.aws_ssm_parameter.github_codestar_connection_arn.value
        FullRepositoryId     = var.repoId
        BranchName           = var.environment
        OutputArtifactFormat = "CODE_ZIP"
      }
    }
  }

  stage {
    name = "Deploy-Image"

    action {
      name            = "Deploy-Image"
      category        = "Build"
      owner           = "AWS"
      provider        = "CodeBuild"
      input_artifacts = ["source_output"]
      version         = "1"

      configuration = {
        ProjectName = aws_codebuild_project.deploy-script-runner-docker-image.name
        EnvironmentVariables = jsonencode([
          {
            name  = "COMMIT_ID",
            type  = "PLAINTEXT"
            value = "#{SourceVariables.CommitId}"
          }
        ])
      }
    }
  }

  trigger {
    provider_type = "CodeStarSourceConnection"
    git_configuration {
      source_action_name = "Source"
      push {
        branches {
          includes = [var.environment]
        }
        file_paths {
          # Whenever something to do with the ARI ingest code or this docker container is changed.
          includes = ["infra/modules/codepipeline/buildspec/deploy-script-runner-docker-image.yml", "api"]
        }
      }
    }
  }
}

data "aws_iam_policy_document" "codepipeline_role_policy" {
  statement {
    effect = "Allow"
    principals {
      type = "Service"
      identifiers = [
        "codepipeline.amazonaws.com",
        "codebuild.amazonaws.com"
      ]
    }
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "codepipeline_role" {
  name = "${var.project_name}-codepipeline-role-${var.environment}"
  tags = {
    Name = "${var.project_name}-codepipeline-role-${var.environment}"
  }

  assume_role_policy = data.aws_iam_policy_document.codepipeline_role_policy.json
}

data "aws_iam_policy_document" "script-runner-docker-image-codepipeline_policy" {
  statement {
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:GetObjectVersion",
      "s3:GetBucketVersioning",
      "s3:PutObject",
      "s3:PutObjectAcl",
      "s3:GetBucketLocation",
      "s3:DeleteObjectVersion",
      "s3:DeleteObject"
    ]
    resources = [
      "${aws_s3_bucket.codepipeline_bucket.arn}",
      "${aws_s3_bucket.codepipeline_bucket.arn}/*"
    ]
  }
  statement {
    effect = "Allow"
    actions = [
      "codebuild:BatchGetBuilds",
      "codebuild:StartBuild",
      "codecommit:GitPull",
      "codestar-connections:UseConnection",
      "ec2:CreateNetworkInterface",
      "ec2:CreateNetworkInterfacePermission",
      "ec2:DeleteNetworkInterface",
      "ec2:Describe*",
      "ecr:CreateRepository",
      "ecr:BatchCheckLayerAvailability",
      "ecr:CompleteLayerUpload",
      "ecr:GetAuthorizationToken",
      "ecr:InitiateLayerUpload",
      "ecr:PutImage",
      "ecr:UploadLayerPart",
      "ecs:UpdateService",
      "iam:PassRole",
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "rds:CreateDBSnapshot",
      "rds:DescribeDBSnapshots",
      "secretsmanager:GetSecretValue",
      "secretsmanager:PutSecretValue"
    ]
    resources = ["*"]
  }
}

// IAM codepipeline policy
resource "aws_iam_role_policy" "script-runner-docker-image-codepipeline_policy" {
  name = "${var.project_name}-script-runner-docker-image-codepipeline_policy-${var.environment}"
  role = aws_iam_role.codepipeline_role.id

  policy = data.aws_iam_policy_document.script-runner-docker-image-codepipeline_policy.json
}
