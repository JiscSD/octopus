locals {
  project_name          = "octopus"
  environment           = terraform.workspace
}

module "network" {
  source          = "../modules/network"
  cidr_block      = "10.0.0.0/16"
  public_subnets  = ["10.0.0.0/24", "10.0.1.0/24", "10.0.2.0/24"]
  private_subnets = ["10.0.100.0/24", "10.0.101.0/24", "10.0.102.0/24"]
  environment     = local.environment
  project_name    = local.project_name
}

module "bastion" {
  source        = "../modules/bastion"
  vpc_id        = module.network.vpc_id
  public_subnet = module.network.public_subnet_ids[0]
  environment   = local.environment
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
  source                     = "../modules/s3"
  environment                = local.environment
  pub_router_api_key         = var.pub_router_api_key
  pub_router_failure_channel = var.pub_router_failure_channel
}

module "ses" {
    source = "../modules/ses"
    environment = local.environment
    email_addresses = var.email_addresses
}

module "sqs" {
  source = "../modules/sqs"
  sns_arn = module.sns.arn
  environment = local.environment
}

module "sns" {
  source = "../modules/sns" 
  environment = local.environment
  slack_channel_email = var.slack_channel_email
}

