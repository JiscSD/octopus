profile = "octopus-dev"

rds_allocated_storage                     = 50
rds_max_allocated_storage                 = 100
rds_instance                              = "db.t4g.medium"
rds_db_version                            = "14.12"
rds_backup_retention_period               = 35
rds_monitoring_interval                   = 60
rds_performance_insights_retention_period = 7

elasticsearch_instance_size = "t3.medium.elasticsearch"
