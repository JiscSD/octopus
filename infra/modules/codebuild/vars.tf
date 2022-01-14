variable "name" {
    type = string
    description = "CodeBuild project name"
}

variable "repo" {
    type = string
    description = "Github repo e.g. 'orgname/projectname'"
}

variable "buildspec" {
    type = string
    description = "Path to a buildspec .yml file, relative to project root"
}

variable "filters" {
    type = list(object({
        type    = string
        pattern = string
    }))
}

variable "stage" {
    type = string
}
