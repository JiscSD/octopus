import htmlToText from 'html-to-text';
import axios from 'axios';
import * as s3 from 'lib/s3';
import * as sqs from 'lib/sqs';
import * as I from 'interface';
import * as helpers from 'lib/helpers';
import * as response from 'lib/response';
import * as publicationService from 'publication/service';
import * as publicationVersionService from 'publicationVersion/service';
import * as referenceService from 'reference/service';
import * as coAuthorService from 'coauthor/service';

export const getAll = async (
    event: I.AuthenticatedAPIRequest<undefined, I.PublicationFilters>
): Promise<I.JSONResponse> => {
    try {
        const openSearchPublications = await publicationService.getOpenSearchRecords(event.queryStringParameters);

        const publicationIds = openSearchPublications.body.hits.hits.map((hit) => hit._id as string);

        const publications = await publicationService.getAllByIds(publicationIds);

        const publicationsOrderedBySearch = publicationIds.map((publicationId) =>
            publications.find((publication) => publication.id === publicationId)
        );

        return response.json(200, {
            data: publicationsOrderedBySearch,
            metadata: {
                total: openSearchPublications.body.hits.total.value,
                limit: Number(event.queryStringParameters.limit) || 10,
                offset: Number(event.queryStringParameters.offset) || 0
            }
        });
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const get = async (
    event: I.APIRequest<undefined, undefined, I.GetPublicationPathParams>
): Promise<I.JSONResponse> => {
    try {
        // Get the publication with the latest version data merged in to keep it simple for the UI.
        const publication = await publicationService.getWithVersionMerged(event.pathParameters.id);

        // anyone can see a LIVE publication
        if (publication?.currentStatus === 'LIVE') {
            return response.json(200, publication);
        }

        if (!publication) {
            return response.json(404, {
                message:
                    'Publication is either not found, or you do not have permissions to view it in its current state.'
            });
        }

        // only the owner or co-authors can view publications
        if (
            event.user?.id === publication.user.id ||
            publication.coAuthors.some((coAuthor) => coAuthor.linkedUser === event.user?.id)
        ) {
            return response.json(200, publication);
        }

        return response.json(404, {
            message: 'Publication is either not found, or you do not have permissions to view it in its current state.'
        });
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

export const deletePublication = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.DeletePublicationPathParams>
): Promise<I.JSONResponse> => {
    try {
        const publication = await publicationService.get(event.pathParameters.id);

        if (!publication) {
            return response.json(403, {
                message: 'This publication does not exist.'
            });
        }

        const firstVersion = publication.versions.find((version) => version.versionNumber === 1);

        if (!firstVersion) {
            throw Error('Unable to get first version');
        }

        if (firstVersion.user.id !== event.user.id) {
            return response.json(403, {
                message: 'You do not have permission to delete this publication.'
            });
        }

        // The logic here is a bit odd, but the currentStatus and publicationStatus array are not intrinsically linked
        // so to be safe, we are checking that the current status is DRAFT and that the entire history of the publication
        // has only ever been draft.
        // Also, for us to delete a publication, there must only have been one version of it.
        if (
            firstVersion.currentStatus !== 'DRAFT' ||
            (firstVersion.publicationStatus &&
                !firstVersion.publicationStatus.every((status) => status.status !== 'LIVE')) ||
            publication.versions.length > 1
        ) {
            return response.json(403, {
                message: 'A publication can only be deleted if it is currently a draft and has never been LIVE.'
            });
        }

        await publicationService.deletePublication(event.pathParameters.id);

        return response.json(200, { message: `Publication ${event.pathParameters.id} deleted` });
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const create = async (
    event: I.AuthenticatedAPIRequest<I.CreatePublicationRequestBody>
): Promise<I.JSONResponse> => {
    try {
        if (
            event.body.selfDeclaration !== undefined &&
            event.body.type !== 'PROTOCOL' &&
            event.body.type !== 'HYPOTHESIS'
        ) {
            return response.json(400, {
                message: 'You can not declare a self declaration for a publication that is not a protocol or hypothesis'
            });
        }

        if (event.body.dataAccessStatement !== undefined && event.body.type !== 'DATA') {
            return response.json(400, {
                message: 'You can not supply a data access statement on and non data publication.'
            });
        }

        if (event.body.dataPermissionsStatement !== undefined && event.body.type !== 'DATA') {
            return response.json(400, {
                message: 'You can not supply a data permissions statement on and non data publication.'
            });
        }

        const doi = await helpers.createEmptyDOI();

        const publication = await publicationService.create(event.body, event.user, doi);

        return response.json(201, publication);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const updateCurrentVersion = async (
    event: I.AuthenticatedAPIRequest<I.UpdatePublicationRequestBody, undefined, I.UpdatePublicationPathParams>
): Promise<I.JSONResponse> => {
    try {
        const publication = await publicationService.getWithVersion(event.pathParameters.id);

        if (!publication) {
            return response.json(403, {
                message: 'This publication does not exist.'
            });
        }

        const currentVersion = publication.versions[0];

        if (!currentVersion) {
            throw Error('Unable to find current version for publication');
        }

        if (currentVersion.user.id !== event.user.id) {
            return response.json(403, {
                message: 'You do not have permission to modify this publication.'
            });
        }

        if (currentVersion.currentStatus !== 'DRAFT') {
            return response.json(404, { message: 'A publication that is not in DRAFT state cannot be updated.' });
        }

        if (event.body.content) {
            event.body.content = helpers.getSafeHTML(event.body.content);
        }

        if (
            event.body.selfDeclaration !== undefined &&
            publication.type !== 'PROTOCOL' &&
            publication.type !== 'HYPOTHESIS'
        ) {
            return response.json(400, {
                message: 'You can not declare a self declaration for a publication that is not a protocol or hypothesis'
            });
        }

        if (event.body.dataAccessStatement !== undefined && publication.type !== 'DATA') {
            return response.json(400, {
                message: 'You can not supply a data access statement on and non data publication.'
            });
        }

        if (event.body.dataPermissionsStatement !== undefined && publication.type !== 'DATA') {
            return response.json(400, {
                message: 'You can not supply a data permissions statement on and non data publication.'
            });
        }

        await publicationService.updateCurrentVersion(event.pathParameters.id, event.body);

        const updatedPublication = await publicationService.getWithVersionMerged(event.pathParameters.id);

        return response.json(200, updatedPublication);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const updateStatus = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.UpdateStatusPathParams>
): Promise<I.JSONResponse> => {
    try {
        const publicationId = event.pathParameters?.id;
        const publication = await publicationService.getWithVersion(publicationId);

        if (!publication) {
            return response.json(404, {
                message: 'This publication does not exist.'
            });
        }

        const currentVersion = publication.versions[0];

        if (currentVersion.createdBy !== event.user.id) {
            return response.json(403, {
                message: 'You do not have permission to modify the status of this publication.'
            });
        }

        const newStatus = event.pathParameters?.status;
        const currentStatus = currentVersion.currentStatus;

        if (currentStatus === 'LIVE') {
            return response.json(403, {
                message: 'A status of a publication that is not in DRAFT or LOCKED cannot be changed.'
            });
        }

        if (currentStatus === newStatus) {
            return response.json(403, { message: `Publication status is already ${newStatus}.` });
        }

        if (currentStatus === 'DRAFT') {
            if (newStatus === 'LOCKED') {
                // check if publication actually has co-authors
                if (currentVersion.coAuthors.length === 1) {
                    return response.json(403, { message: 'Publication cannot be LOCKED without co-authors.' });
                }

                // check if publication is ready to be LOCKED
                if (!publicationService.isReadyToLock(publication)) {
                    return response.json(403, {
                        message: 'Publication is not ready to be LOCKED. Make sure all fields are filled in.'
                    });
                }

                // Lock publication from editing
                await publicationVersionService.updateStatus(currentVersion.id, 'LOCKED');

                return response.json(200, { message: 'Publication status updated to LOCKED.' });
            }

            if (newStatus === 'LIVE') {
                const isReadyToPublish = publicationService.isReadyToPublish(publication);

                if (!isReadyToPublish) {
                    return response.json(403, {
                        message: 'Publication is not ready to be made LIVE. Make sure all fields are filled in.'
                    });
                }
            }
        }

        if (currentStatus === 'LOCKED') {
            if (newStatus === 'DRAFT') {
                // Update status to 'DRAFT'
                await publicationVersionService.updateStatus(currentVersion.id, newStatus);

                // Cancel co author approvals
                await coAuthorService.resetCoAuthors(currentVersion.id);

                return response.json(200, {
                    message: 'Publication unlocked for editing'
                });
            }

            if (newStatus === 'LIVE') {
                const isReadyToPublish = publicationService.isReadyToPublish(publication);

                if (!isReadyToPublish) {
                    return response.json(403, {
                        message: 'Publication is not ready to be made LIVE. Make sure all fields are filled in.'
                    });
                }
            }
        }

        const updatedVersion = await publicationVersionService.updateStatus(currentVersion.id, newStatus);

        // now that the publication is LIVE, we store in opensearch
        await publicationService.createOpenSearchRecord({
            id: updatedVersion.id,
            type: updatedVersion.publication.type,
            title: updatedVersion.title,
            licence: updatedVersion.licence,
            description: updatedVersion.description,
            keywords: updatedVersion.keywords,
            content: updatedVersion.content,
            publishedDate: updatedVersion.publishedDate,
            cleanContent: htmlToText.convert(updatedVersion.content)
        });

        const references = await referenceService.getAllByPublication(publicationId);

        // Publication is live, so update the DOI
        await helpers.updateDOI(publication.doi, publication, references);

        // send message to the pdf generation queue
        // currently only on deployed instances while a local solution is developed
        if (process.env.STAGE !== 'local') await sqs.sendMessage(publicationId);

        return response.json(200, { message: 'Publication is now LIVE.' });
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const getLinksForPublication = async (
    event: I.APIRequest<undefined, undefined, I.GetPublicationPathParams>
): Promise<I.JSONResponse> => {
    try {
        const data = await publicationService.getLinksForPublication(event.pathParameters.id);

        // If publication doesn't exist or has no LIVE version
        if (!data.publication || !data.publication.versions.some((version) => version.currentStatus === 'LIVE')) {
            return response.json(404, { message: 'Not found.' });
        }

        return response.json(200, data);
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
    const publicationId = event.pathParameters.id;
    const publication = await publicationService.get(publicationId);

    if (!publication) {
        return response.json(404, {
            message: 'This publication does not exist.'
        });
    }

    if (!publication.versions.some((version) => version.currentStatus === 'LIVE')) {
        return response.json(403, {
            message: 'Publication needs to be LIVE in order to generate a PDF version of it.'
        });
    }

    let pdfUrl: string | null = null;

    if (!generateNewPDF) {
        // check if there's a generated PDF for this publication
        try {
            const currentPdfUrl = `${s3.endpoint}/science-octopus-publishing-pdfs-${process.env.STAGE}/${publicationId}.pdf`;
            const result = await axios.get(currentPdfUrl);

            if (result.status === 200) {
                pdfUrl = currentPdfUrl;
            }
        } catch (error) {
            console.log(error);
        }
    }

    if (!pdfUrl) {
        // generate new PDF
        try {
            // We know the publication has at least one LIVE version.
            const latestPublishedVersion =
                publication.versions.find((version) => version.isCurrent && version.currentStatus === 'LIVE') ||
                publication.versions.find((version) => version.versionNumber === publication.versions.length - 1);

            if (!latestPublishedVersion) {
                throw Error('Unable to get latest published version from supplied object');
            }

            const publicationWithLatestPublishedVersion = await publicationService.getWithVersion(
                publication.id,
                latestPublishedVersion.versionNumber
            );

            if (!publicationWithLatestPublishedVersion) {
                throw Error('Unable to get latest published version from DB');
            }

            const newPDFUrl = await publicationService.generatePDF(publicationWithLatestPublishedVersion);

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

export const getResearchTopics = async (): Promise<I.JSONResponse> => {
    try {
        const researchTopics = await publicationService.getResearchTopics();

        return response.json(200, researchTopics);
    } catch (error) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};
