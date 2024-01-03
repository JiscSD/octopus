locals {
  project_name = "octopus"
  environment  = terraform.workspace
}

data "aws_ssm_parameter" "vpc_cidr_block" {
  name = "vpc_cidr_block_${local.environment}_${local.project_name}"
}

module "network" {
  source       = "../modules/network"
  environment  = local.environment
  project_name = local.project_name
}

module "bastion" {
  source            = "../modules/bastion"
  vpc_id_new        = module.network.vpc_id_new
  public_subnet_new = module.network.public_subnet_ids_new[0]
  environment       = local.environment
}

module "postgres" {
  source                                = "../modules/postgres"
  private_subnet_ids_new                = module.network.private_subnet_ids_new
  environment                           = local.environment
  vpc_id_new                            = module.network.vpc_id_new
  vpc_cidr_block                        = data.aws_ssm_parameter.vpc_cidr_block.value
  allocated_storage                     = var.rds_allocated_storage
  max_allocated_storage                 = var.rds_max_allocated_storage
  instance                              = var.rds_instance
  project_name                          = local.project_name
  db_version                            = var.rds_db_version
  backup_retention_period               = var.rds_backup_retention_period
  monitoring_interval                   = var.rds_monitoring_interval
  performance_insights_retention_period = var.rds_performance_insights_retention_period
}

module "elasticsearch" {
  source                 = "../modules/elasticsearch"
  private_subnet_ids_new = module.network.private_subnet_ids_new
  environment            = local.environment
  vpc_id_new             = module.network.vpc_id_new
  vpc_cidr_block         = data.aws_ssm_parameter.vpc_cidr_block.value
  instance_size          = var.elasticsearch_instance_size
}

module "s3" {
  source       = "../modules/s3"
  environment  = local.environment
  project_name = local.project_name
}

module "ses" {
  source       = "../modules/ses"
  environment  = local.environment
  project_name = local.project_name
}

module "sqs" {
  source      = "../modules/sqs"
  sns_arn     = module.sns.arn
  environment = local.environment
}

module "sns" {
  source       = "../modules/sns"
  environment  = local.environment
  project_name = local.project_name
}

