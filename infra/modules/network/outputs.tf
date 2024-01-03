output "vpc_id" {
  value = aws_vpc.main.id
}

output "vpc_id_new" {
  value = aws_vpc.main_new.id
}

output "public_subnet_ids" {
  value = [
    aws_subnet.public_az1.id,
    aws_subnet.public_az2.id,
    aws_subnet.public_az3.id,
  ]
}

output "public_subnet_ids_new" {
  value = [
    aws_subnet.public_az1_new.id,
    aws_subnet.public_az2_new.id,
    aws_subnet.public_az3_new.id,
  ]
}

output "private_subnet_ids" {
  value = [
    aws_subnet.private_az1.id,
    aws_subnet.private_az2.id,
    aws_subnet.private_az3.id,
  ]
}

output "private_subnet_ids_new" {
  value = [
    aws_subnet.private_az1_new.id,
    aws_subnet.private_az2_new.id,
    aws_subnet.private_az3_new.id,
  ]
}
