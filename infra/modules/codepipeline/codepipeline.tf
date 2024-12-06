data "aws_ssm_parameter" "github_codestar_connection_arn" {
  name = "${var.project_name}_github_codestar_connection_arn"
}

resource "aws_codepipeline" "docker-image-codepipeline" {
  name          = "${var.project_name}-docker-image-pipeline-${var.environment}"
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
        FullRepositoryId     = "JiscSD/octopus"
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
        ProjectName = aws_codebuild_project.deploy-docker-image.name
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
}

resource "aws_iam_role" "codepipeline_role" {
  name = "${var.project_name}-codepipeline-role-${var.environment}"
  tags = {
    Name = "${var.project_name}-codepipeline-role-${var.environment}"
  }

  assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": [
                        "codepipeline.amazonaws.com",
                        "codebuild.amazonaws.com"
                ]
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
EOF
}

// IAM codepipeline policy
resource "aws_iam_role_policy" "codepipeline_policy" {
  name = "${var.project_name}-codepipeline_policy-${var.environment}"
  role = aws_iam_role.codepipeline_role.id

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:GetObjectVersion",
                "s3:GetBucketVersioning",
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetBucketLocation",
                "s3:DeleteObjectVersion",
                "s3:DeleteObject"
            ],
            "Resource": [
                "${aws_s3_bucket.codepipeline_bucket.arn}",
                "${aws_s3_bucket.codepipeline_bucket.arn}/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "codestar-connections:UseConnection"
            ],
            "Resource": [
                "*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "codecommit:GitPull"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "codebuild:BatchGetBuilds",
                "codebuild:StartBuild"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": [
                "*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "ecr:CreateRepository",
                "ecr:BatchCheckLayerAvailability",
                "ecr:CompleteLayerUpload",
                "ecr:GetAuthorizationToken",
                "ecr:InitiateLayerUpload",
                "ecr:PutImage",
                "ecr:UploadLayerPart",
                "ecs:UpdateService",
                "secretsmanager:GetSecretValue",
                "secretsmanager:PutSecretValue"
            ],                
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "rds:DescribeDBSnapshots",
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "rds:CreateDBSnapshot",
            "Resource": [
                "*"
            ]
        },              
        {
            "Effect": "Allow",
            "Action": [
                "ec2:Describe*",
                "ec2:DeleteNetworkInterface",
                "ec2:CreateNetworkInterface",
                "ec2:CreateNetworkInterfacePermission",
                "iam:PassRole"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}
