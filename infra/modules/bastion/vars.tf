variable "vpc_id" {
    type = string
}

variable "public_subnet" {
    type = string
}

variable "environment" {
    type = string
}

variable "ec2_key_name" {
    type = string
}

variable "allowable_ips" {
    type = list(string)
}

variable "third_party_vpn_ips" {
    type = list(string)
}
