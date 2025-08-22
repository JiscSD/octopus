variable "project_name" {
  type        = string
  description = "The name of the project, in snake case"
}

variable "environment" {
  type = string
}

variable "repoId" {
  type        = string
  description = "The GitHub repository ID in the form owner/repo"
}