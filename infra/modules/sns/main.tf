data "aws_ssm_parameter" "slack_channel_email" {
  name = "slack_channel_email_${var.environment}_${var.project_name}"
}

resource "aws_sns_topic" "pdf-queue-dlq-messages-topic" {
  name            = "pdf-queue-dlq-messages-topic-${var.environment}"
  delivery_policy = <<EOF
{
  "http": {
    "defaultHealthyRetryPolicy": {
      "minDelayTarget": 20,
      "maxDelayTarget": 20,
      "numRetries": 3,
      "numMaxDelayRetries": 0,
      "numNoDelayRetries": 0,
      "numMinDelayRetries": 0,
      "backoffFunction": "linear"
    },
    "disableSubscriptionOverrides": false,
    "defaultThrottlePolicy": {
      "maxReceivesPerSecond": 1
    }
  }
}
EOF
}


resource "aws_sns_topic_subscription" "notify-slack-dlq" {
  topic_arn = aws_sns_topic.pdf-queue-dlq-messages-topic.arn
  protocol  = "email"
  endpoint  = data.aws_ssm_parameter.slack_channel_email.value
}
