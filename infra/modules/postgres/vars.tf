variable "environment" {
    type = string
}

variable "project_name" {
    type        = string
    description = "The name of the project"
}

variable "vpc_subnet_ids" {
    type = list(string)
}

variable "vpc_id" {
    type = string
}

variable "allowable_ips" {
    type = list(string)
}

variable "publicly_accessible" {
    type = bool
}

variable "allocated_storage" {
    type = number
}

variable "instance" {
    type = string
}

variable "storage_type" {
    type = string
}

variable "rds_identifier" {
    type = string
}

variable "db_version" {
    type = string
}
