# variable "full_domain_name" {
#   type = string
# }

variable "allocated_storage" {
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

variable "pub_router_failure_channel" {
  type = string
  sensitive = true
}

variable "pub_router_api_key" {
  type = string
  sensitive = true
}