import axios from 'axios';
import * as helpers from 'lib/helpers';
import * as I from 'interface';
import * as linkService from 'link/service';
import * as publicationService from 'publication/service';
import * as publicationVersionService from 'publicationVersion/service';
import * as response from 'lib/response';
import * as s3 from 'lib/s3';
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

        return response.json(200, fields ? helpers.buildPartialResponse(fields, publication) : publication);
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

            if (helpers.isEmptyContent(content || '')) {
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
                    const validateLink = await linkService.createLinkValidation(
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
            event.body.content = helpers.getSafeHTML(content);
        }

        const doi = await helpers.createEmptyDOI();

        const publication = await publicationService.create(event.body, event.user, doi, directPublish, links);

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
    let includeDraftVersion = false;

    try {
        if (user) {
            const latestVersion = await publicationVersionService.get(publicationId, 'latest');

            // if latest version is a DRAFT, check if user can see it
            if (
                latestVersion?.currentStatus !== 'LIVE' &&
                (user.id === latestVersion?.createdBy ||
                    latestVersion?.coAuthors.some((coAuthor) => coAuthor.linkedUser === user.id))
            ) {
                includeDraftVersion = true;
            }
        }

        const { publication, linkedFrom, linkedTo } = directLinks
            ? await publicationService.getDirectLinksForPublication(publicationId, includeDraftVersion)
            : await publicationService.getLinksForPublication(publicationId, includeDraftVersion);

        if (!publication) {
            return response.json(404, { message: 'Not found.' });
        }

        return response.json(200, { publication, linkedFrom, linkedTo });
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const getPDF = async (
    event: I.APIRequest<undefined, I.GeneratePDFQueryParams, I.GeneratePDFPathParams>
): Promise<I.JSONResponse> => {
    const generateNewPDF = event.queryStringParameters?.generateNewPDF === 'true';
    const redirectToPreview = event.queryStringParameters?.redirectToPreview === 'true';
    const publicationId = event.pathParameters.publicationId;
    const publication = await publicationService.get(publicationId);

    if (!publication) {
        return response.json(404, {
            message: 'This publication does not exist.'
        });
    }

    if (!publication.versions.some((version) => version.isLatestLiveVersion)) {
        return response.json(403, {
            message: 'Publication needs to be LIVE in order to generate a PDF version of it.'
        });
    }

    let pdfUrl: string | null = null;

    if (!generateNewPDF) {
        // check if there's a generated PDF for this publication
        try {
            const currentPdfUrl = `${s3.endpoint}/${s3.buckets.pdfs}/${publicationId}.pdf`;
            const result = await axios.get(currentPdfUrl);

            if (result.status === 200) {
                pdfUrl = currentPdfUrl;
            }
        } catch (error) {
            console.log(error);
        }
    }

    if (!pdfUrl || generateNewPDF) {
        // Generate new PDF (overwrites if there is an existing one).
        try {
            // We know the publication has at least one LIVE version.
            const latestPublishedVersion = await publicationVersionService.get(publication.id, 'latestLive');

            if (!latestPublishedVersion) {
                throw Error('Unable to get latest published version from supplied object');
            }

            const newPDFUrl = await publicationVersionService.generatePDF(latestPublishedVersion);

            if (!newPDFUrl) {
                throw Error('Failed to generate PDF');
            }

            pdfUrl = newPDFUrl;
        } catch (error) {
            console.log(error);

            return response.json(500, 'The PDF version of this publication has failed to generate');
        }
    }

    return redirectToPreview
        ? {
              statusCode: 302,
              headers: {
                  Location: pdfUrl
              }
          }
        : response.json(200, { pdfUrl });
};
