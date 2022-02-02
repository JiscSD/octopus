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
