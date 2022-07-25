locals {
  project_name          = "octopus"
  project_key_pair_name = "octopus-ssh"
  environment           = terraform.workspace
  allowable_ips = [
    "193.62.83.114/32", // vpn
    "193.62.83.115/32", // vpn
    "194.81.3.15/32",   // vpn
    "194.81.3.16/32",   // vpn
    "10.0.0.0/16",      // vpc
    "10.100.0.0/16"     // vpc pairing with code build
  ]
}

module "network" {
  source          = "../modules/network"
  cidr_block      = "10.0.0.0/16"
  public_subnets  = ["10.0.0.0/24", "10.0.1.0/24", "10.0.2.0/24"]
  private_subnets = ["10.0.100.0/24", "10.0.101.0/24", "10.0.102.0/24"]
  environment     = local.environment
  project_name    = local.project_name
}

# module "frontend" {
#   source         = "../modules/frontend"
#   vpc_id         = module.network.vpc_id
#   public_subnet  = module.network.public_subnet_ids[0]
#   ec2_key_name   = local.project_key_pair_name
#   allowable_ips  = local.allowable_ips
#   domain_name    = var.domain_name
#   environment    = local.environment
#   public_subnets = module.network.public_subnet_ids
# }

module "bastion" {
  source        = "../modules/bastion"
  vpc_id        = module.network.vpc_id
  public_subnet = module.network.public_subnet_ids[0]
  environment   = local.environment
  allowable_ips = local.allowable_ips
  ec2_key_name  = local.project_key_pair_name
}

module "postgres" {
  source                  = "../modules/postgres"
  private_subnet_ids      = module.network.private_subnet_ids
  environment             = local.environment
  vpc_id                  = module.network.vpc_id
  allocated_storage       = var.allocated_storage
  instance                = var.instance
  project_name            = local.project_name
  db_version              = var.db_version
  backup_retention_period = var.backup_retention_period
}

module "elasticsearch" {
  source             = "../modules/elasticsearch"
  private_subnet_ids = module.network.private_subnet_ids
  environment        = local.environment
  vpc_id             = module.network.vpc_id
  instance_size      = var.elasticsearch_instance_size
}

module "s3" {
  source             = "../modules/s3"
  environment        = local.environment
}

module "ses" {
  source = "../modules/ses"
  environment = local.environment
}

module "api" {
  source = "../modules/api"
  environment = local.environment
  project_name = local.project_name
}
