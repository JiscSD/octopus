resource "aws_amplify_app" "octopus-ui" {
  name = "octopus-ui"
  repository = "https://github.com/JiscSD/octopus"
  platform = "WEB_DYNAMIC"
  build_spec = <<-EOT
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
  iam_service_role_arn          = "arn:aws:iam::948306873545:role/amplifyconsole-backend-role"
  environment_variables = {
    "AMPLIFY_MONOREPO_APP_ROOT" = "ui"
    "AMPLIFY_DIFF_DEPLOY"               = "false"
    "NEXT_PUBLIC_BASE_URL"              = "null"
    "NEXT_PUBLIC_MEDIA_BUCKET"          = "null"
    "NEXT_PUBLIC_ORCID_APP_ID"          = "null"
    "NEXT_PUBLIC_STAGE"                 = "null"
    "NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF" = "null"
    "_LIVE_UPDATES"                     = jsonencode(
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