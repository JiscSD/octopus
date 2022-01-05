data "aws_iam_policy_document" "build" {
    statement {
        actions = [
            "sts:AssumeRole"
        ]

        principals {
            type = "Service"
            identifiers = [
                "apigateway.amazonaws.com",
                "lambda.amazonaws.com",
                "events.amazonaws.com",
                "codebuild.amazonaws.com"
            ]
        }
    }
}

data "aws_iam_policy_document" "build_policy" {
    statement {
        actions = [
            "*"
        ]
        resources = [
            "*"
        ]
    }
}

resource "aws_iam_role" "build" {
    assume_role_policy = data.aws_iam_policy_document.build.json
}

resource "aws_iam_role_policy" "build" {
    role = aws_iam_role.build.id
    policy = data.aws_iam_policy_document.build_policy.json
}
