resource "aws_codebuild_webhook" "build" {
    project_name    = aws_codebuild_project.build.name

    filter_group {
        dynamic "filter" {
            for_each = var.filters
            content {
                type    = filter.value["type"]
                pattern = filter.value["pattern"]
            }
        }
    }
}

resource "aws_codebuild_project" "build" {
    name            = var.name
    service_role    = aws_iam_role.build.arn

    source {
        type        = "GITHUB"
        location    = "https://github.com/${var.repo}.git"
        buildspec   = var.buildspec
    }

    environment {
        compute_type                    = "BUILD_GENERAL1_MEDIUM"
        image                           = "aws/codebuild/standard:5.0"
        privileged_mode                 = true
        type                            = "LINUX_CONTAINER"
        
        environment_variable {
            name  = "STAGE"
            value = var.stage
        } 
    }

    artifacts {
        type = "NO_ARTIFACTS"
    }
}
