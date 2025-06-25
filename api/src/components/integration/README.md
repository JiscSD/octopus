# Integrations

Octopus integrates with other systems in order to import their data and transform it into octopus publications.

## General points

### How publications from integrations are stored

Publications imported via an integration with another system should have the following optional fields (from the Publication model) populated as follows:

-   externalId
    -   The ID of the source item on the other system. For example, a question imported from the ARI DB would have the question ID in this field.
-   externalSource
    -   A label for the external system the publication was imported from. There is a controlled list for this defined as an enum in the [Prisma schema](../../../prisma/schema.prisma).

They should also always be owned by an organisational user account. That is, a user with the value `ORGANISATION` for the `role` field.

### Where/how does this run?

On deployed environments, integrations are run in containers on AWS Elastic Container Service. These containers are defined in the infrastructure code (see [Dockerfile](../../../../infra/docker/scriptRunner/Dockerfile)), so they can be built and tested locally from the `infra/docker/scriptRunner` directory with `docker compose up`, passing the desired compose file with the `-f` flag (such as [ari-import.compose.yml](../../../../infra/docker/scriptRunner/ari-import.compose.yml)).

These task containers may be triggered using an API key protected API endpoint that in turn triggers the task to spin up (e.g. the `triggerARIIngest` endpoint), or automatically at a specified time by an Eventbridge scheduler (see this in the [infra code](../../../../infra/modules/ecs/schedule.tf)).

They can also be run ad hoc on the local environment via npm scripts, for example (from the `api` directory):

`npm run ariImport -- dryRun=true allDepartments=true full=false`

## Specific integrations

### ARI DB

The ARI DB is a UK government database storing research questions that government departments are seeking to answer. More info can be found at the [website](https://ari.org.uk/).

#### ARI import process

ARIs can be excluded from the import process for one of these reasons:

-   The `isArchived` field is `true`.
-   The `department` field doesn't correspond to one of our participating departments.
    -   These are defined in an environment variable (`PARTICIPATING_ARI_USER_IDS`) as a comma-separated list of octopus user IDs. Each ID corresponds to the organisational account representing an ARI department.
    -   At import time, the user mapping table is consulted to get the expected names the departments have on the ARI DB side. As such, user mappings must also exist in the octopus DB for a department to be included properly.

On import, ARIs go through a handling flow:

-   If no publication exists with the ARI's question ID in its `externalId` field, it is created as a new publication.
-   If a publication does exist with the ARI's question ID in its `externalId` field, it is compared to the existing publication for changes.
    -   If changes are found, the existing publication is updated with those changes applied. Note that this is not a reversioning - ARI publications always have only one version.
    -   If no changes are found, no action is taken.

#### How ARI data is mapped to octopus data

Various ARI fields are mapped to octopus ones in the `mapAriQuestionToPublicationVersion` function in [ariUtils.ts](./ariUtils.ts).

Of particular importance is how ARIs are matched to an owning organisational user account. The mapping process expects a UserMapping to exist associating the `department` field value from the ARI (where the title matches, case insensitive, and the mapping source is 'ARI') with the user ID of an organisational account.

Topics are mapped similarly. If an ARI has values in its `topics` field, the mapping will check whether octopus has any TopicMappings in the database that match with them and associate the publication it creates/updates with the topic(s) from those mappings. If there are no topics listed on the ARI, the organisational user is expected to have a `defaultTopicId`, which is used as a fallback.

#### Archived ARIs

ARIs can be archived. This presents an issue for Octopus, which doesn't have a way of archiving publications as such. To deal with this, we have the `ariArchivedCheck` [script](../../../scripts/ariArchivedCheck.ts) / ECS task. It will see if any ARIs octopus has already imported have become archived since they were imported. If so, it will set the `archived` field on the publication to match the value on the ARI db. We can then use this to display on the front end that the publication is archived.
