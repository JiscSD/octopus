# variable "full_domain_name" {
#   type = string
# }

variable "allocated_storage" {
  type = number
}

variable "storage_type" {
  type = string
}

variable "instance" {
  type = string
}

variable "publicly_accessible" {
  type = bool
}

# variable "acm_certificate_arn" {
#   type = string
# }

variable "rds_identifier" {
  type = string
}

variable "db_version" {
  type = string
}
