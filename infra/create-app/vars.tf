# variable "full_domain_name" {
#   type = string
# }

variable "rds_allocated_storage" {
  type = number
}

variable "rds_max_allocated_storage" {
  type = number
}
variable "rds_instance" {
  type = string
}

variable "rds_db_version" {
  type = string
}

variable "rds_backup_retention_period" {
  type = number
}

variable "rds_monitoring_interval" {
  type = number
}

variable "rds_performance_insights_retention_period" {
  type = number
}

variable "domain_name" {
  type = string
}

variable "elasticsearch_instance_size" {
  type = string
}

variable "email_addresses" {
  type = map(list(string))
}

variable "slack_channel_email" {
  type = string
  sensitive = true
}