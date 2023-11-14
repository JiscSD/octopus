variable "project_name" {
  type        = string
  description = "The name of the project, in snake case"
}

variable "cidr_block" {
  type = string
}

variable "environment" {
  type = string
}
