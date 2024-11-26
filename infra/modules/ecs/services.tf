resource "aws_security_group" "hello-world-task-sg" {
  name                   = "${var.project_name}-hello-world-task-sg-${var.environment}"
  description            = "Security group for hello world ecs service"
  vpc_id                 = var.vpc_id
  revoke_rules_on_delete = true

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-hello-world-task-sg-${var.environment}"
  }
}

resource "aws_ecs_service" "hello-world" {
  name                   = "${var.project_name}-hello-world-${var.environment}"
  cluster                = aws_ecs_cluster.ecs.id
  task_definition        = "${aws_ecs_task_definition.hello-world.id}:${aws_ecs_task_definition.hello-world.revision}"
  enable_execute_command = true
  launch_type            = "FARGATE"
  desired_count          = 1

  network_configuration {
    assign_public_ip = true
    subnets          = var.public_subnet_ids
    security_groups  = [aws_security_group.hello-world-task-sg.id]
  }

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }
}
