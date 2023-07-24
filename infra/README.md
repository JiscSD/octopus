<img src="https://www.jisc.ac.uk/sites/all/themes/jisc_clean/img/jisc-logo.svg" align="right" width=50 height=50/><h1 align="left">Infrastructure</h1>

This project uses [Terraform](https://www.terraform.io/) to manage all the required infastructure (please see the _[Not managed by Terraform](#Not-managed-by-Terraform)_ section for exceptions to this).
The purpose of this is to ensure all infastructure is handled via code so that it can be tracked and documented easily.

Any work that cannot be achieved through Terraform should be kept as minimal as possible.

## Terraform Version

This should work with the latest terraform version (1.5.2 at the time of writing). Please see [tfenv](https://github.com/tfutils/tfenv) for more information on managing your terraform version.

To check your local version, open your command line and run:

```bash
$ terraform -v
```

You should get the following output, showing your terraform version and OS:

```bash
Terraform v1.5.2
on linux_amd64
```

## Modules

Terraform has a concept of _modules_, which are reuseable chunks of code similar to _packages_. We can easily pull these in and their implementation is consistent across
projects. This project has set up its modules so that they never have to be changed; only their variables can be adjusted in the top-level `main.tf`. The modules are stored in `infra/modules`.

## Workspaces

We use [Terraform workspaces](https://learn.hashicorp.com/tutorials/terraform/organize-configuration?in=terraform/modules) to separate our environments. The reason for this is because the infrastructure composition between environments doesn't change, but some attributes may - e.g. RDS instance size. This is handled by having a separate variables file per environment - e.g. `int.tfvars` - and passing that in as a flag when we `terraform apply` within a particular workspace. 

The infrastructure is created/updated by simply switching to the correct workspace and applying, passing in the correct variables file:

```bash
$ terraform workspace select int
$ terraform apply --var-file=int.tfvars
```

Workspaces currently in use:

-   **`int`**
-   **`prod`**

## Create application

**⚠️ Please speak to the project lead before attempting to run this Terraform app locally. ⚠️**

Location: `~/infra/create-app`

The `create-app` Terraform sets up the main project's int & prod environments on AWS. Details can be found in `~/infra/create-app/main.tf` which contains the used modules and the information passed to those modules.
As this project uses workspaces, there are **two** tfvars files, one per environment. This way, the environments are 1:1 and their only differences are value related - i.e the technology behind stays the same, just the values are different. An example of this may be that the int environment has a smaller allocated size for the database, whereas production would be larger.

To run this Terraform, follow the below:

```bash
~/infra/create-app $ terraform init                             # init the terraform
~/infra/create-app $ terraform workspace select $WORKSPACE      # select the environment workspace (int or prod)
~/infra/create-app $ terraform plan --var-file=int.tfvars       # pre-apply dry run (pass in environment vars)
~/infra/create-app $ terraform apply --var-file=int.tfvars      # apply the terraform (pass in environment vars)
```

## Not managed by Terraform

There are some parts of this project's infrastructure that are **not** managed/created by Terraform. These were created manually and must be managed manually in AWS. They are as follows:

- An `AWS S3 Bucket`, for hosting the Terraform State file **(octopus-tfstate)**.
- Configuration to increase the limit of allowed VPCs for a single region (default 5) to 50.
- Most Route 53 config
- AWS Amplify config

## Migration to prod AWS account
We are in the process of moving the prod environment to a separate AWS account. Until this is done, there are the following additional things to note:
- There is a new workspace called `new-prod` with its own `.tfvars` file. We will remove this after the migration. For now, it allows us to provision prod-like resources in parallel to the currently running prod environment.
- Terraform will expect a number of profiles to be defined in your `~/.aws/credentials` file when running commands, depending on the account you're working with:
    - `octopus-tfstate`: a separate account to store terraform state for all environments, and other centralised things TBD
    - `octopus-prod`: the account for the prod environment (where new-prod currently lives, and where prod will eventually live)
    - `octopus-dev`: the account for the int environment (where prod and int currently live, and eventually will only contain int)