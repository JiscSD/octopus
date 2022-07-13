import htmlToText from 'html-to-text';
import * as I from 'interface';
import * as helpers from 'lib/helpers';
import * as response from 'lib/response';
import * as publicationService from 'publication/service';

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
        const publication = await publicationService.get(event.pathParameters.id);

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

        if (publication.user.id !== event.user.id) {
            return response.json(403, {
                message: 'You do not have permission to delete this publication.'
            });
        }

        // the logic here is a bit odd, but the currentStatus and publicationStatus array are not intrisinsicly linked
        // so to be safe, we are checking that the current status is DRAFT and that the entire history of the publication
        // has only ever been draft
        if (
            publication.currentStatus !== 'DRAFT' ||
            !publication.publicationStatus.every((status) => status.status === 'DRAFT')
        ) {
            return response.json(403, {
                message: 'A publication can only be deleted if has only ever been DRAFT.'
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

export const update = async (
    event: I.AuthenticatedAPIRequest<I.UpdatePublicationRequestBody, undefined, I.UpdatePublicationPathParams>
) => {
    try {
        const publication = await publicationService.get(event.pathParameters.id);

        if (!publication) {
            return response.json(403, {
                message: 'This publication does not exist.'
            });
        }

        if (publication?.user.id !== event.user.id) {
            return response.json(403, {
                message: 'You do not have permission to modify this publication.'
            });
        }

        if (publication?.currentStatus !== 'DRAFT') {
            return response.json(404, { message: 'A publication that is not in DRAFT state cannot be updated.' });
        }

        if (event.body.content) {
            const isHTMLSafe = helpers.isHTMLSafe(event.body.content);

            if (!isHTMLSafe) {
                return response.json(404, {
                    message:
                        'HTML is not safe, please check out the <a href="https://octopus.ac/api-documentation#content">API documentation.</a>'
                });
            }
        }

        if (event.body.id) {
            const isIdInUse = await publicationService.isIdInUse(event.body.id);

            if (isIdInUse) {
                return response.json(404, { message: 'ID is already in use.' });
            }
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

        const updatedPublication = await publicationService.update(event.pathParameters.id, event.body);

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
        const publication = await publicationService.get(event.pathParameters.id);

        if (publication?.user.id !== event.user.id) {
            return response.json(403, {
                message: 'You do not have permission to modify the status of this publication.'
            });
        }

        // TODO, eventually a service in LIVE can be HIDDEN and a service HIDDEN can become LIVE
        if (publication?.currentStatus !== 'DRAFT') {
            return response.json(404, { message: 'A status of a publication that is not in DRAFT cannot be changed.' });
        }

        const isReadyToPublish = publicationService.isPublicationReadyToPublish(
            publication,
            event.pathParameters.status
        );

        if (!isReadyToPublish) {
            return response.json(404, {
                message: 'Publication is not ready to be made LIVE. Make sure all fields are filled in.'
            });
        }

        const updatedPublication = await publicationService.updateStatus(
            event.pathParameters.id,
            event.pathParameters.status,
            isReadyToPublish
        );

        // now that the publication is LIVE, we store in opensearch
        await publicationService.createOpenSearchRecord({
            id: updatedPublication.id,
            type: updatedPublication.type,
            title: updatedPublication.title,
            licence: updatedPublication.licence,
            description: updatedPublication.description,
            keywords: updatedPublication.keywords,
            content: updatedPublication.content,
            publishedDate: updatedPublication.publishedDate,
            cleanContent: htmlToText.convert(updatedPublication.content)
        });

        // Publication is live, so update the DOI
        const res = await helpers.updateDOI(publication.doi, publication);
        console.log(res);
        // TODO:  Do we want to do anything with this response?

        return response.json(200, updatedPublication);
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

        if (!data.rootPublication || data.rootPublication.currentStatus !== 'LIVE') {
            return response.json(404, { message: 'Not found.' });
        }

        return response.json(200, data);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};
