# Octopus API documentation

This directory contains the files needed to deploy a static [documentation page](https://jiscsd.github.io/octopus/) for the octopus API.

The majority of the files are taken straight from [Swagger UI](https://swagger.io/tools/swagger-ui/), and our own OpenAPI specification is also included (`api.yml`).

The page is deployed using [github pages](https://pages.github.com/).

## How to make changes

### Changing the content

To change the actual content of the documentation, edit the `api.yml` (OpenAPI spec) file. The Swagger UI files will take this file and generate the page you see on our deployed site.

This can be done however you like, but a good option is to use the editor in [SwaggerHub](https://app.swaggerhub.com/). The API spec file can be imported and edited in the browser with a live preview of how the eventual page will look.

### Updating the Swagger UI files

Our `api/docs` directory contains the files from Swagger UI's [dist](https://github.com/swagger-api/swagger-ui/tree/master/dist) directory. In case these need to be updated, follow this process:

-   Get the Swagger UI repo:
    -   [Download](https://github.com/swagger-api/swagger-ui/archive/refs/heads/master.zip) it as a .zip file and unzip it
    -   or clone the repo: `git clone https://github.com/swagger-api/swagger-ui`
-   Move the files, e.g.:
    -   `mv swagger-ui-master/dist/* octopus/api/docs`

## Deployment

The API docs site is set up to deploy using github pages when updates are made to `main` branch. We are using a configuration based on [Github Actions](https://docs.github.com/en/actions) to do this. See the [configuration file](../../.github/workflows/deploy-api-docs.yml) for more details.
