#!/bin/bash

BASTION_ID=$1

aws ec2 terminate-instances --instance-ids $BASTION_ID  &> /dev/null
echo "Bastion terminated"