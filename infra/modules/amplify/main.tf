data "aws_ssm_parameter" "orcid_prod" {
  name = "orcid_app_id_prod_octopus"
}

data "aws_ssm_parameter" "orcid_int" {
  name = "orcid_app_id_int_octopus"
}

resource "aws_amplify_app" "octopus-ui" {
  name                 = "octopus-ui"
  repository           = "https://github.com/JiscSD/octopus"
  platform             = "WEB_DYNAMIC"
  build_spec           = <<-EOT
version: 1
applications:
  - frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
    appRoot: ui
  EOT
  iam_service_role_arn = "arn:aws:iam::948306873545:role/amplifyconsole-backend-role"
  environment_variables = {
    "AMPLIFY_MONOREPO_APP_ROOT"         = "ui"
    "AMPLIFY_DIFF_DEPLOY"               = "false"
    "NEXT_PUBLIC_BASE_URL"              = "null"
    "NEXT_PUBLIC_MEDIA_BUCKET"          = "null"
    "NEXT_PUBLIC_ORCID_APP_ID"          = "null"
    "NEXT_PUBLIC_STAGE"                 = "null"
    "NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF" = "null"
    "_LIVE_UPDATES" = jsonencode(
      [
        {
          pkg     = "next-version"
          type    = "internal"
          version = "latest"
        },
      ]
    )
  }
  custom_rule {
    source = "https://octopus.ac"
    status = "302"
    target = "https://www.octopus.ac"
  }
  custom_rule {
    source = "https://octopuspublishing.org"
    status = "302"
    target = "https://www.octopus.ac"
  }
  custom_rule {
    source = "https://www.octopuspublishing.org"
    status = "302"
    target = "https://www.octopus.ac"
  }
  custom_rule {
    source = "/privacy/privacy"
    status = "301"
    target = "/privacy"
  }
  custom_rule {
    source = "/<*>"
    status = "200"
    target = "https://d2ylbkl403qrza.cloudfront.net/<*>"
  }
  custom_rule {
    source = "/<*>"
    status = "200"
    target = "https://dwj7btrds8is2.cloudfront.net/<*>"
  }
  custom_rule {
    source = "/<*>"
    status = "200"
    target = "https://d17u3l3tnvr7jr.cloudfront.net/<*>"
  }
  custom_rule {
    source = "/<*>"
    status = "200"
    target = "https://d3ahr60abfvx5r.cloudfront.net/<*>"
  }
  custom_rule {
    source = "/<*>"
    status = "404-200"
    target = "/index.html"
  }

  lifecycle {
    prevent_destroy = true
    ignore_changes = [
      production_branch
    ]
  }
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.octopus-ui.id
  branch_name = "main"
  framework   = "Next.js - SSR"
  stage       = "PRODUCTION"
  environment_variables = {
    "NEXT_PUBLIC_BASE_URL"              = "https://www.octopus.ac"
    "NEXT_PUBLIC_MEDIA_BUCKET"          = "https://science-octopus-publishing-images-prod.s3.eu-west-1.amazonaws.com"
    "NEXT_PUBLIC_ORCID_APP_ID"          = nonsensitive(data.aws_ssm_parameter.orcid_int.value)
    "NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF" = "prod"
  }
}

resource "aws_amplify_branch" "holding" {
  app_id      = aws_amplify_app.octopus-ui.id
  branch_name = "holding"
  framework   = "Next.js - SSR"
  environment_variables = {
    "NEXT_PUBLIC_BASE_URL"              = "https://holding.octopus.ac"
    "NEXT_PUBLIC_MEDIA_BUCKET"          = "https://science-octopus-publishing-images-prod.s3.eu-west-1.amazonaws.com"
    "NEXT_PUBLIC_ORCID_APP_ID"          = nonsensitive(data.aws_ssm_parameter.orcid_int.value)
    "NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF" = "prod"
  }
}

resource "aws_amplify_branch" "int" {
  app_id              = aws_amplify_app.octopus-ui.id
  branch_name         = "int"
  framework           = "Next.js - SSR"
  enable_notification = true
  environment_variables = {
    "NEXT_PUBLIC_BASE_URL"              = "https://int.octopus.ac"
    "NEXT_PUBLIC_MEDIA_BUCKET"          = "https://science-octopus-publishing-images-int.s3.eu-west-1.amazonaws.com"
    "NEXT_PUBLIC_ORCID_APP_ID"          = nonsensitive(data.aws_ssm_parameter.orcid_int.value)
    "NEXT_PUBLIC_STAGE"                 = "int"
    "NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF" = "int"
  }
}

resource "aws_amplify_branch" "prod" {
  app_id              = aws_amplify_app.octopus-ui.id
  branch_name         = "prod"
  framework           = "Next.js - SSR"
  enable_notification = true
  environment_variables = {
    "NEXT_PUBLIC_BASE_URL"              = "https://www.octopus.ac"
    "NEXT_PUBLIC_MEDIA_BUCKET"          = "https://science-octopus-publishing-images-prod.s3.eu-west-1.amazonaws.com"
    "NEXT_PUBLIC_ORCID_APP_ID"          = nonsensitive(data.aws_ssm_parameter.orcid_prod.value)
    "NEXT_PUBLIC_STAGE"                 = "prod"
    "NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF" = "prod"
  }

}
