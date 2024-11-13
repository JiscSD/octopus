locals {
  only_in_production_mapping = {
    int  = 0
    prod = 1
  }
  only_in_production = local.only_in_production_mapping[terraform.workspace]
}

data "aws_ssm_parameter" "github_oidc_provider_arn" {
  name = "${var.project_name}_github_oidc_provider_arn"
}

data "aws_iam_policy_document" "trust_github_oidc" {
  count = local.only_in_production
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [data.aws_ssm_parameter.github_oidc_provider_arn.value]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:JiscSD/octopus:*"]
    }
  }
}

resource "aws_iam_role" "github_actions_role" {
  count              = local.only_in_production
  name               = "github-actions-role-${var.environment}-${var.project_name}"
  description        = "Role used by github actions"
  assume_role_policy = data.aws_iam_policy_document.trust_github_oidc[local.only_in_production - 1].json

}

resource "aws_iam_policy" "deploy_backend" {
  count = local.only_in_production
  name  = "deploy-backend-${var.environment}-${var.project_name}"
  policy = jsonencode(
    {
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Sid" : "VisualEditor0",
          "Effect" : "Allow",
          "Action" : [
            "kms:Decrypt",
            "kms:Encrypt",
            "kms:DescribeKey",
            "kms:CreateGrant",
            "cloudformation:*",
            "cloudwatch:*",
            "events:ListTargetsByRule",
            "events:DescribeRule",
            "iam:ListRolePolicies",
            "iam:ListAttachedRolePolicies",
            "iam:GetRolePolicy",
            "iam:GetRole",
            "iam:GetInstanceProfile",
            "iam:PassRole",
            "sts:GetCallerIdentity",
            "ssm:GetParameter",
            "ssm:StartSession",
            "ssm:DescribeInstanceInformation",
            "ec2:RunInstances",
            "ec2:DescribeSecurityGroups",
            "ec2:DescribeSubnets",
            "ec2:DescribeVpcs",
            "apigateway:*",
            "lambda:*",
            "logs:*",
            "s3:*"
          ],
          "Resource" : [
            "*"
          ]
        }
      ]
  })
}

resource "aws_iam_role_policy_attachment" "trust_github_oidc" {
  count      = local.only_in_production
  role       = aws_iam_role.github_actions_role[local.only_in_production - 1].name
  policy_arn = aws_iam_policy.deploy_backend[local.only_in_production - 1].arn
}
