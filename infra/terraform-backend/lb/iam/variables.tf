variable "account_id" {
  description = "AWS account ID"
  type        = string
  default     = "000"
}

variable "user" {
  description = "AWS user"
  type        = string
  default     = "terraform-user"
}

variable "component_name" {
  description = "Component name"
  type        = string
  default     = "ecr-"
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}
