resource "aws_sns_topic" "science-octopus-dlq-messages-topic" {
  name            = "science-octopus-dlq-messages-topic-${var.environment}"
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
  topic_arn = aws_sns_topic.dlq_messages_topic.arn
  protocol  = "email"
  endpoint  = var.slack_channel_email
}