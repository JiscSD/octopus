variable "environment" {
  type = string
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "project_name" {
  type = string
}

variable "public_subnet_ids" {
  type = list(string)
}

variable "vpc_id" {
  type = string
}
