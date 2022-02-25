locals {
    repo = "JiscSD/octopus"
}

module "deploy-application-int" {
    source              = "../modules/codebuild"

    name                = "deploy-application-int"
    repo                = local.repo
    buildspec           = "infra/pipeline/deploy-application-int.yml"
    stage               = "int"

    filters = [
        {
            type = "EVENT",
            pattern = "PUSH"
        },
        {
            type    = "HEAD_REF"
            pattern = "main"
        }
    ]
}

module "deploy-application-prod" {
    source              = "../modules/codebuild"

    name                = "deploy-application-prod"
    repo                = local.repo
    buildspec           = "infra/pipeline/deploy-application-prod.yml"
    stage               = "prod"

    filters = [
        {
            type = "EVENT",
            pattern = "PUSH"
        },
        {
            type    = "HEAD_REF"
            pattern = "refs/tags/*"
        }
    ]
}
