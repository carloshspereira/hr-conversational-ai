variable "account_id" {
  description = "AWS account ID"
  type        = string
  default     = "413467296690"
}

variable "user" {
  description = "AWS user"
  type        = string
  default     = "terraform-user"
}

variable "component_name" {
  description = "Component name"
  type        = string
  default     = "s3-ipea-eia366-pbrent366"
}

variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}
