# Octopus API documentation

This directory contains the files needed to deploy a static [documentation page](https://jisc.github.io/octopus/) for the octopus API.

These are:

-   An HTML file, which includes [Swagger UI](https://swagger.io/tools/swagger-ui/) via CDN
-   Our OpenAPI specification (`api.yml`)

The page is deployed using [github pages](https://pages.github.com/).

## How to make changes

### Changing the content

To change the actual content of the documentation, edit the `api.yml` (OpenAPI spec) file. The Swagger UI files will take this file and generate the page you see on our deployed site.

This can be done however you like, but a good option is to use the editor in [SwaggerHub](https://app.swaggerhub.com/). The API spec file can be imported and edited in the browser with a live preview of how the eventual page will look. To export it in the format we use, hit Export -> Download API -> YAML Unresolved.

### Updating the Swagger UI version

Simply change the version number in the src attribute of the `<script>` tags in `index.html`.

## Deployment

The API docs site is set up to deploy using github pages when updates are made to `main` branch. We are using a configuration based on [Github Actions](https://docs.github.com/en/actions) to do this. See the [configuration file](../../.github/workflows/deploy-api-docs.yml) for more details.
