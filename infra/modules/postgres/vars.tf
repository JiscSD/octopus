variable "environment" {
  type = string
}

variable "project_name" {
  type        = string
  description = "The name of the project"
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "vpc_id" {
  type = string
}

variable "allocated_storage" {
  type = number
}

variable "max_allocated_storage" {
  type = number
}

variable "instance" {
  type = string
}

variable "db_version" {
  type = string
}

variable "backup_retention_period" {
  type = number
}

variable "monitoring_interval" {
  type = number
}

variable "performance_insights_retention_period" {
  type = number
}