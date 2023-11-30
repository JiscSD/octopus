variable "project_name" {
  type        = string
  description = "The name of the project, in snake case"
}

variable "cidr_block" {
  type = string
}

variable "public_subnets" {
  type = list(string)
}

variable "private_subnets" {
  type = list(string)
}

variable "environment" {
  type = string
}
