variable "environment" {
  type = string
}

variable "private_route_table_id" {
  type = string
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "project_name" {
  type = string
}

variable "task_security_group_id" {
  type = string
}

variable "vpc_id" {
  type = string
}
