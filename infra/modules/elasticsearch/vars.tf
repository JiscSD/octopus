variable "vpc_id" {
  type = string
}

variable "environment" {
  type = string
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "instance_size" {
  type = string
}

variable "vpc_cidr_block" {
  type = string
}
