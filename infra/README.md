<img src="https://www.jisc.ac.uk/sites/all/themes/jisc_clean/img/jisc-logo.svg" align="right" width=50 height=50/><h1 align="left">Infrastructure</h1>

This project uses [Terraform](https://www.terraform.io/) to manage all the required infastructure (please see the _[Not managed by Terraform](#Not-managed-by-Terraform)_ section for exceptions to this).
The purpose of this is to ensure all infastruchure that is created, is handled via code so that it can be tracked & documented easily.

Any work that cannot be achived through Terraform should be kept as minimal as possible.

&nbsp;

## Modules

Terraform has a concept of _modules_, which are reuseable chunks of code, similar to _packages_ so that we can easily pull them in & their implementation is consistent across
projects. This project has set up it's modules so that they never have to be changed, only their varibles can be adjusted in the `main.tf`.

-   **Bastion** `~/infra/modules/bastion`
-   **Codebuild** `~/infra/modules/codebuild`
-   **Network** `~/infra/modules/network`
-   **Postgress** `~/infra/modules/postgres`
-   **SES** `~/infra/modules/ses`
-   Frontend `~/infra/modules/frontend` - TODO
-   S3 `~/infra/modules/s3` - TODO
-   Elasticsearch `~/infra/modules/elasticsearch` - TODO

&nbsp;

## Workspaces

We use [Terraform workspaces](https://learn.hashicorp.com/tutorials/terraform/organize-configuration?in=terraform/modules) to separate our environments. The reason for this is because the infrastructure composition betweeen environments doesn't change, but some attributes may - e.g. RDS instance size. This is handled by the having separate variables file per environment and passing that in as a flag when we `terraform apply` within a particular workspace. e.g. `int.tfvars`.

The infrastructure is created/updated by simply switching to the correct workspace and applying, passing in the correct variables file:

```bash
$ terraform workspace select int
$ terraform apply -var-file=int.tfvars
```

Workspaces currently in use:

`int`

`prod`

# Create CI/CD

**⚠️ Please speak to the project lead before attempting to run this Terraform app locally. ⚠️**

Location: `~/infra/create-ci-cd`

The `create-ci-cd` Terraform sets up the [AWS Codebuild](https://aws.amazon.com/codebuild/) and only needs to be applied/ran **once**, regardless of how many environments/workspaces there are. This does not need to be updated with each change to main/production.

This project current only sets up one trigger, `PULL_REQUEST_MERGED`.
The code build will only trigger when a PR is merged into branch `main`.

To create this infrastructure you will need to:

1. Make sure there is an `S3 bucket` on the AWS account called `octopus-app-tfstate`, this is referenced in [create-ci-cd/provider.tf](./create-cicd/provider.tf). Ths `S3 bucket` is where the remote state for this terraformed infrastructure is stored, this is something that has to be created manually, referenced in the _[Not managed by Terraform](#Not-managed-by-Terraform)_ section.
2. Ensure you have the correct version of Terraform installed, you can find the required Terraform version in the [create-ci-cd/provider.tf](./create-cicd/provider.tf) file.
3. Once the correct version of Terraform is installed, you can simply run:

```bash
~/infra/create-ci-cd $ terraform init    # init the terraform
~/infra/create-ci-cd $ terraform plan    # pre-apply dry run
~/infra/create-ci-cd $ terraform apply   # apply the terraform
```

&nbsp;

# Create application

**⚠️ Please speak to the project lead before attempting to run this Terraform app locally. ⚠️**

Location: `~/infra/create-app`

The `create-app` Terraform sets up the main projects int & prod enviroments on AWS. Details of which can be found in the `~/infra/create-app/main.tf` which contains the used modules and the information passed to those modules.
As this project uses workspaces, there are **two** tfvar files, one per enviroment, this way the enviroments are 1:1 and their ownly differences are value related, i.e the technology behind stays the same, just the values are different. An example of this may be that the int enviroment has a smaller allocated size for the database, where as production would be larger.

To run this Terraform, follow the below:

```bash
~/infra/create-app $ terraform init                             # init the terraform
~/infra/create-app $ terraform workspace select $WORKSPACE      # select the enviroment workspace (int or prod)
~/infra/create-app $ terraform plan -var-file=int.tfvars        # pre-apply dry run (pass in enviroment vars)
~/infra/create-app $ terraform apply -var-file=int.tfvars       # apply the terraform (pass in enviroment vars)
```

&nbsp;

# Database migrations & seeds

TODO

&nbsp;

# Not managed by Terraform

TODO

&nbsp;
