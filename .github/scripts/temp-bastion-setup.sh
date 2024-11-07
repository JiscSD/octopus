#!/bin/bash

ENV=$1
HOST=$2
CICD=$3

trap ctrl_c INT

# Catch ctrl+c being pressed, allows easy ending of the session and still handling cleanup. Note this does not handle spamming ctrl+c or double ctrl+c
function ctrl_c() {
    echo "Cleaning up session, please wait."

    if [ -z "$BASTION" ]; then
        exit 0
    fi

    aws ec2 terminate-instances --instance-ids $BASTION &> /dev/null
    echo "Bastion terminated"
    exit 0
}

IMAGE_ID=$(aws ssm get-parameter --name /aws/service/ami-amazon-linux-latest/amzn2-ami-kernel-5.10-hvm-x86_64-gp2 --query "Parameter.Value" --output text)

# Get subnet by name
SUBNET=$(aws ec2 describe-subnets --filters "Name=tag:Name,Values=${ENV}_octopus_public_subnet*" --query "Subnets[0].SubnetId" --output text)

# Get instance profile by name
INSTANCE_PROFILE=$(aws iam get-instance-profile --instance-profile-name "ec2_profile_$ENV" --query "InstanceProfile.Arn" --output text)

# Get Security Group by name
SG_ID=$(aws ec2 describe-security-groups --filters "Name=tag:Name,Values=bastion_sg_$ENV" --query "SecurityGroups[0].GroupId" --output text)

# Create bastion EC2
BASTION=$(aws ec2 run-instances --image-id $IMAGE_ID --instance-type "t2.micro" --iam-instance-profile '{"Arn": "'$INSTANCE_PROFILE'"}' --subnet-id $SUBNET --security-group-ids $SG_ID --metadata-options '{"HttpTokens": "required"}' --associate-public-ip-address --user-data "$USER_DATA" --query "Instances[0].InstanceId" --output text)

while [[ "$(aws ssm describe-instance-information --instance-information-filter-list "key=InstanceIds,valueSet='$BASTION'" --query "InstanceInformationList[0].AgentVersion")" == "null" ]]
do 
  sleep 7
  echo "Waiting for SSM Agent to start up"
done

echo "BASTION_ID=$BASTION" >> $GITHUB_OUTPUT

# Note the "&" at the end, this runs the session in the background so the workflow can continue. 
aws ssm start-session --target $BASTION --document-name AWS-StartPortForwardingSessionToRemoteHost --parameters '{"host":["'$HOST'"],"portNumber":["5432"], "localPortNumber":["5432"]}' &