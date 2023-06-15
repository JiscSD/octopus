variable "environment" {
  type = string
}

variable "slack_channel_email" {
  type = string
  sensitive = true
}