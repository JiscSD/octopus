import * as response from 'lib/response';
import * as publicationService from 'publication/service';
import * as I from 'interface';

export const getAll = async (): Promise<I.JSONResponse> => {
    try {
        const publications = await publicationService.getAll();

        return response.json(200, publications);
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const get = async (event: I.AuthenticatedAPIRequest<undefined, undefined, I.GetPublicationPathParams>): Promise<I.JSONResponse> => {
    try {
        const publication = await publicationService.get(event.pathParameters.id);


        // anyone can see a LIVE publication
        if (publication?.currentStatus === 'LIVE') {
            publication.user.firstName = publication?.user.firstName[0];

            return response.json(200, publication);
        }

        // only certain users can see a DRAFT publication
        if(event.user?.id === publication?.user.id) {
            return response.json(200, publication);
        }

        return response.json(404, { message: 'Publication is either not found, or you do not have permissions to view it in its current state.' });
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const create = async (event: I.AuthenticatedAPIRequest<I.CreatePublicationRequestBody>): Promise<I.JSONResponse> => {
    try {
        const publication = await publicationService.create(event.body, event.user);

        return response.json(200, publication);
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const updateStatus = async (event: I.AuthenticatedAPIRequest<undefined, undefined, I.UpdateStatusPathParams>): Promise<I.JSONResponse> => {
    try {
        const publication = await publicationService.get(event.pathParameters.id);

        if (publication?.user.id !== event.user.id) {
            return response.json(403, { message: 'You do not have permission to modify the status of this publication.' });
        }

        // TODO, eventually a service in LIVE can be HIDDEN and a service HIDDEN can become LIVE
        if (publication?.currentStatus !== 'DRAFT') {
            return response.json(404, { message: 'A status of a publication that is not in DRAFT cannot be changed.' });
        }

        // check content, is it in a state where it can go live.
        const publicationHasAllKeys = ['title', 'content'].every((field) => publication[field]);

        const isPublicationReadyForPublish = publicationHasAllKeys && publication.linkedTo.length !== 0;

        if (!isPublicationReadyForPublish && event.pathParameters.status === 'LIVE') {
            return response.json(404, { message: 'Publication is not ready to be made LIVE. Make sure all fields are filled in.' });
        }

        const updatedPublication = await publicationService.updateStatus(event.pathParameters.id, event.pathParameters.status);

        return response.json(200, updatedPublication);

    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};