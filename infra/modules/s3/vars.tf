variable "environment" {
  type = string
}

variable "pub_router_failure_channel" {
  type = string
  sensitive = true
}

variable "pub_router_api_key" {
  type = string
  sensitive = true
}