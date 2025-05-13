resource "aws_sqs_queue" "pdf-generation-queue" {
  name = "pdf-generation-queue-${var.environment}-${var.project_name}"

  visibility_timeout_seconds = 30
  delay_seconds              = 0
  max_message_size           = 2048
  message_retention_seconds  = 86400
  receive_wait_time_seconds  = 0
  sqs_managed_sse_enabled    = (var.environment == "prod")

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.pdf-generation-dlq.arn
    maxReceiveCount     = 1
  })

}

resource "aws_sqs_queue" "pdf-generation-dlq" {
  name                    = "pdf-generation-dlq-${var.environment}-${var.project_name}"
  sqs_managed_sse_enabled = (var.environment == "prod")
}

resource "aws_cloudwatch_metric_alarm" "dlq-messages-sent-alarm" {
  alarm_name          = "pdf-generation-dlq-messages-sent-alarm-${var.environment}-${var.project_name}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "ApproximateNumberOfMessagesVisible"
  namespace           = "AWS/SQS"
  period              = 120
  statistic           = "Average"
  threshold           = 0
  alarm_description   = "This metric monitors if any messages enter the DLQ"
  alarm_actions       = [var.sns_arn]

  dimensions = {
    QueueName = aws_sqs_queue.pdf-generation-dlq.name
  }

}


