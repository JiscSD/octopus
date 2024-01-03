variable "vpc_id_new" {
  type = string
}

variable "environment" {
  type = string
}

variable "private_subnet_ids_new" {
  type = list(string)
}

variable "instance_size" {
  type = string
}

variable "vpc_cidr_block" {
  type = string
}
