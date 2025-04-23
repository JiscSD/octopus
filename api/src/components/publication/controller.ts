import * as Helpers from 'lib/helpers';
import * as I from 'interface';
import * as linkController from 'link/controller';
import * as publicationService from 'publication/service';
import * as publicationVersionService from 'publicationVersion/service';
import * as response from 'lib/response';
import * as topicService from 'topic/service';

export const get = async (
    event: I.APIRequest<undefined, I.GetPublicatonQueryParams, I.GetPublicationPathParams>
): Promise<I.JSONResponse> => {
    try {
        const publication = await publicationService.get(event.pathParameters.publicationId);
        const fields = event.queryStringParameters?.fields;

        if (!publication) {
            return response.json(404, {
                message: 'Publication not found.'
            });
        }

        // only the owner or co-authors can view the DRAFT/LOCKED versions
        publication.versions = publication.versions.filter((version) =>
            version.currentStatus === 'LIVE'
                ? true
                : event.user?.id === version.createdBy ||
                  version.coAuthors.some((author) => author.linkedUser === event.user?.id)
        );

        if (!publication.versions.length) {
            return response.json(403, { message: "You don't have permissions to view this publication." });
        }

        return response.json(200, fields ? Helpers.buildPartialResponse(fields, publication) : publication);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const getSeedDataPublications = async (
    event: I.APIRequest<undefined, I.GetSeedDataPublicationsFilters>
): Promise<I.JSONResponse> => {
    try {
        const publications = await publicationService.getSeedDataPublications(event.queryStringParameters.title);

        return response.json(200, {
            publications
        });
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const create = async (
    event: I.AuthenticatedAPIRequest<I.CreatePublicationRequestBody, I.CreatePublicationQueryStringParameters>
): Promise<I.JSONResponse> => {
    const { directPublish } = event.queryStringParameters;
    const {
        content,
        dataAccessStatement,
        dataPermissionsStatement,
        externalId,
        externalSource,
        linkedPublicationIds,
        selfDeclaration,
        topicIds,
        type
    } = event.body;
    const links: { publicationId: string; versionId: string }[] = [];

    try {
        if (type !== 'PROBLEM' && event.user.role === 'ORGANISATION') {
            return response.json(403, {
                message: 'Organisational accounts can only create Research Problems.'
            });
        }

        if (directPublish) {
            if (event.user.role !== 'ORGANISATION') {
                return response.json(403, {
                    message: 'Only organisational accounts can publish directly.'
                });
            }

            if (Helpers.isEmptyContent(content || '')) {
                return response.json(400, {
                    message: 'Content field cannot be empty when publishing directly.'
                });
            }

            if (!publicationVersionService.validateConflictOfInterest(event.body)) {
                return response.json(400, {
                    message:
                        'Conflict of interest status must either be false, or true and accompanied by a conflict of interest text value in order to direct publish.'
                });
            }

            // The publication must be linked to a topic or publication.
            // If the organisational account doesn't have a default topic,
            // topic/publication ID(s) must be provided.
            if (!event.user.defaultTopicId && !topicIds?.length && !linkedPublicationIds?.length) {
                return response.json(400, {
                    message:
                        'At least one topic ID or linked publication ID must be provided, as your organisation does not have a default topic.'
                });
            }

            // All proposed links must be valid.
            if (linkedPublicationIds) {
                for (const linkTargetId of linkedPublicationIds) {
                    const validateLink = await linkController.createLinkValidation(
                        {
                            existing: false,
                            type: type
                        },
                        linkTargetId,
                        event.user.id
                    );

                    if (!validateLink.valid) {
                        return response.json(validateLink.details.code, {
                            message: validateLink.details.message
                        });
                    } else {
                        links.push(validateLink.toPublication);
                    }
                }
            }

            // All proposed topics must exist.
            if (topicIds) {
                for (const topicId of topicIds) {
                    const topic = await topicService.get(topicId);

                    if (!topic) {
                        return response.json(400, {
                            message: `Topic with ID ${topicId} not found.`
                        });
                    }
                }
            }
        }

        if (topicIds?.length && type !== 'PROBLEM') {
            return response.json(400, {
                message: 'You cannot link a publication to a topic if it is not a research problem.'
            });
        }

        if (selfDeclaration !== undefined && type !== 'PROTOCOL' && type !== 'HYPOTHESIS') {
            return response.json(400, {
                message: 'You cannot declare a self declaration for a publication that is not a protocol or hypothesis.'
            });
        }

        if (dataAccessStatement !== undefined && type !== 'DATA') {
            return response.json(400, {
                message: 'You cannot supply a data access statement on a non-data type publication.'
            });
        }

        if (dataPermissionsStatement !== undefined && type !== 'DATA') {
            return response.json(400, {
                message: 'You cannot supply a data permissions statement on a non-data type publication.'
            });
        }

        if ((externalId || externalSource) && event.user.role !== 'ORGANISATION') {
            return response.json(400, {
                message: 'External ID and external source fields can only be populated by organisational accounts.'
            });
        }

        if ((externalId && !externalSource) || (externalSource && !externalId)) {
            return response.json(400, {
                message: 'An external ID must be accompanied by an external source and vice versa.'
            });
        }

        if (content) {
            event.body.content = Helpers.getSafeHTML(content);
        }

        const publication = await publicationService.create(event.body, event.user, directPublish, links);

        return response.json(201, publication);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const getLinksForPublication = async (
    event: I.APIRequest<undefined, I.GetPublicationLinksQueryParams, I.GetPublicationLinksPathParams>
): Promise<I.JSONResponse> => {
    const publicationId = event.pathParameters.publicationId;
    const directLinks = event.queryStringParameters?.direct === 'true';
    const user = event.user;
    let requesterIsAuthorOnDraft = false;

    try {
        if (user && directLinks) {
            const latestVersion = await publicationVersionService.get(publicationId, 'latest');

            // if latest version is a DRAFT, check if user can see it
            if (
                latestVersion?.currentStatus !== 'LIVE' &&
                (user.id === latestVersion?.createdBy ||
                    latestVersion?.coAuthors.some((coAuthor) => coAuthor.linkedUser === user.id))
            ) {
                requesterIsAuthorOnDraft = true;
            }
        }

        const { publication, linkedFrom, linkedTo } = directLinks
            ? await publicationService.getDirectLinksForPublication(
                  publicationId,
                  user?.id || null,
                  requesterIsAuthorOnDraft
              )
            : await publicationService.getLinksForPublication(publicationId, user?.id || null);

        if (!publication) {
            return response.json(404, { message: 'Not found.' });
        }

        return response.json(200, { publication, linkedFrom, linkedTo });
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};
