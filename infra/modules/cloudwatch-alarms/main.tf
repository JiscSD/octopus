locals {
  alarm_namespace = "${var.project_name}/RDS"
}

resource "aws_cloudwatch_log_metric_filter" "rds_log_filter" {
  name           = "rds-used-percent-${var.environment}-${var.project_name}"
  pattern        = "{$.instanceID=\"${var.rds_instance_identifier}\" && $.fileSys[0].usedPercent=*}"
  log_group_name = "RDSOSMetrics"

  metric_transformation {
    name      = "RDSUsedPercent"
    namespace = local.alarm_namespace
    value     = "$.fileSys[0].usedPercent"
  }
}

resource "aws_cloudwatch_metric_alarm" "rds_90_percent" {
  alarm_name          = "rds-used-90-percent-${var.environment}-${var.project_name}"
  comparison_operator = "GreaterThanThreshold"
  alarm_description   = "RDS storage space used is above 90%"
  evaluation_periods  = 1
  metric_name         = aws_cloudwatch_log_metric_filter.rds_log_filter.metric_transformation[0].name
  namespace           = local.alarm_namespace
  statistic           = "Average"
  threshold           = 90
  period              = 60
  alarm_actions       = [var.notification_topic_arn]
  ok_actions          = [var.notification_topic_arn]
}

resource "aws_cloudwatch_metric_alarm" "rds_95_percent" {
  alarm_name          = "rds-used-95-percent-${var.environment}-${var.project_name}"
  comparison_operator = "GreaterThanThreshold"
  alarm_description   = "RDS storage space used is above 95%"
  evaluation_periods  = 1
  metric_name         = aws_cloudwatch_log_metric_filter.rds_log_filter.metric_transformation[0].name
  namespace           = local.alarm_namespace
  statistic           = "Average"
  threshold           = 95
  period              = 60
  alarm_actions       = [var.notification_topic_arn]
  ok_actions          = [var.notification_topic_arn]
}

resource "aws_cloudwatch_metric_alarm" "rds_99_percent" {
  alarm_name          = "rds-used-99-percent-${var.environment}-${var.project_name}"
  comparison_operator = "GreaterThanThreshold"
  alarm_description   = "RDS storage space used is above 99%"
  evaluation_periods  = 1
  metric_name         = aws_cloudwatch_log_metric_filter.rds_log_filter.metric_transformation[0].name
  namespace           = local.alarm_namespace
  statistic           = "Average"
  threshold           = 99
  period              = 60
  alarm_actions       = [var.notification_topic_arn]
  ok_actions          = [var.notification_topic_arn]
}
