output "vpc_id_new" {
  value = aws_vpc.main_new.id
}
output "public_subnet_ids_new" {
  value = [
    aws_subnet.public_az1_new.id,
    aws_subnet.public_az2_new.id,
    aws_subnet.public_az3_new.id,
  ]
}

output "private_subnet_ids_new" {
  value = [
    aws_subnet.private_az1_new.id,
    aws_subnet.private_az2_new.id,
    aws_subnet.private_az3_new.id,
  ]
}
