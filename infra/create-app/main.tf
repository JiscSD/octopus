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
  source        = "../modules/bastion"
  vpc_id        = module.network.vpc_id
  public_subnet = module.network.public_subnet_ids[0]
  environment   = local.environment
}

module "postgres" {
  source                                = "../modules/postgres"
  private_subnet_ids                    = module.network.private_subnet_ids
  environment                           = local.environment
  vpc_id                                = module.network.vpc_id
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
  source             = "../modules/elasticsearch"
  private_subnet_ids = module.network.private_subnet_ids
  environment        = local.environment
  vpc_id             = module.network.vpc_id
  vpc_cidr_block     = data.aws_ssm_parameter.vpc_cidr_block.value
  instance_size      = var.elasticsearch_instance_size
}

module "oidc" {
  source       = "../modules/oidc"
  environment  = local.environment
  project_name = local.project_name
  repoId       = var.repoId
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
  source       = "../modules/sqs"
  sns_arn      = module.sns.topic_arn
  environment  = local.environment
  project_name = local.project_name
}

module "sns" {
  source       = "../modules/sns"
  environment  = local.environment
  project_name = local.project_name
}

module "cloudfront" {
  source       = "../modules/cloudfront"
  environment  = local.environment
  project_name = local.project_name
  # Multiple providers are needed to create resources in different regions.
  providers = {
    # Default provider (default region).
    aws = aws
    # Us-east-1 provider, required for cloudfront distribution's web ACL.
    aws.us-east-1-provider = aws.us-east-1-provider
  }
}

module "ecs" {
  source             = "../modules/ecs"
  environment        = local.environment
  private_subnet_ids = module.network.private_subnet_ids
  project_name       = local.project_name
  vpc_id             = module.network.vpc_id
}

module "ecr" {
  source                 = "../modules/ecr"
  environment            = local.environment
  private_route_table_id = module.network.private_route_table_id
  private_subnet_ids     = module.network.private_subnet_ids
  project_name           = local.project_name
  task_security_group_id = module.ecs.task_security_group_id
  vpc_id                 = module.network.vpc_id
}

module "codepipeline" {
  source       = "../modules/codepipeline"
  environment  = local.environment
  project_name = local.project_name
  repoId       = var.repoId
}

module "cloudwatch_alarms" {
  source                  = "../modules/cloudwatch-alarms"
  environment             = local.environment
  project_name            = local.project_name
  notification_topic_arn  = module.sns.topic_arn
  rds_instance_identifier = module.postgres.rds_instance_identifier
}
