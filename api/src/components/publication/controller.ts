import * as response from 'lib/response';
import * as helpers from 'lib/helpers';
import * as publicationService from 'publication/service';
import * as I from 'interface';

export const getAll = async (
    event: I.AuthenticatedAPIRequest<undefined, I.PublicationFilters>
): Promise<I.JSONResponse> => {
    try {
        const publications = await publicationService.getAll(event.queryStringParameters);

        return response.json(200, publications);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const get = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.GetPublicationPathParams>
): Promise<I.JSONResponse> => {
    try {
        const publication = await publicationService.get(event.pathParameters.id);

        // anyone can see a LIVE publication
        if (publication?.currentStatus === 'LIVE') {
            return response.json(200, publication);
        }

        // only certain users can see a DRAFT publication
        if (event.user?.id === publication?.user.id) {
            return response.json(200, publication);
        }

        return response.json(404, {
            message: 'Publication is either not found, or you do not have permissions to view it in its current state.'
        });
    } catch (err) {
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
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const create = async (
    event: I.AuthenticatedAPIRequest<I.CreatePublicationRequestBody>
): Promise<I.JSONResponse> => {
    try {
        const publication = await publicationService.create(event.body, event.user);

        return response.json(201, publication);
    } catch (err) {
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

        const updatedPublication = await publicationService.update(event.pathParameters.id, event.body);

        return response.json(200, updatedPublication);
    } catch (err) {
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

        return response.json(200, updatedPublication);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const createFlag = async (
    event: I.AuthenticatedAPIRequest<I.CreateFlagRequestBody, undefined, I.CreateFlagPathParams>
) => {
    try {
        const publication = await publicationService.get(event.pathParameters.id);

        if (!publication || publication.currentStatus !== 'LIVE') {
            return response.json(404, {
                message: 'Cannot flag that a publication that does not exist, or is not LIVE'
            });
        }

        if (publication.user.id === event.user.id) {
            return response.json(403, {
                message: 'Cannot flag your own publication'
            });
        }

        const flag = await publicationService.createFlag(
            event.pathParameters.id,
            event.user.id,
            event.body.category,
            event.body.comments
        );

        return response.json(201, flag);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};
