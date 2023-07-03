variable "environment" {
    type = string
}

variable "email_addresses" {
    type = map(list(string))
}
