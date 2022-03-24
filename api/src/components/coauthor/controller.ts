import * as response from 'lib/response';
import * as publicationService from 'publication/service';
import * as coAuthorService from './service';
import * as I from 'interface';

export const create = async (
    event: I.AuthenticatedAPIRequest<I.CreateCoAuthorRequestBody, undefined, I.CreateCoAuthorPathParams>
): Promise<I.JSONResponse> => {
    try {
        const publication = await publicationService.get(event?.pathParameters.id);

        // Does the publication exist?
        if (!publication) {
            return response.json(404, {
                message: 'This publication does not exist.'
            });
        }

        // Is this user the author of the publication?
        if (publication?.user.id !== event?.user.id) {
            return response.json(403, {
                message: 'You do not have the right permissions for this action.'
            });
        }

        // Is the publication in draft?
        if (publication.currentStatus === 'LIVE') {
            return response.json(403, {
                message: 'This publication is LIVE and therefore cannot be edited.'
            });
        }

        // Is the email already added to this publication as a coauthor?
        if (event?.body.email) {
            const isUserAlreadyCoAuthor = await coAuthorService.isUserAlreadyCoAuthor(
                event.body,
                event?.pathParameters.id
            );

            if (isUserAlreadyCoAuthor) {
                return response.json(409, { message: 'This email has already been added as a co-author.' });
            }
        }

        const coAuthor = await coAuthorService.create(event.body, event?.pathParameters.id);

        return response.json(200, coAuthor);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const deleteCoAuthor = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.DeleteCoAuthorPathParams>
): Promise<I.JSONResponse> => {
    try {
        const publication = await publicationService.get(event?.pathParameters.id);

        // Does the publication exist?
        if (!publication) {
            return response.json(404, {
                message: 'This publication does not exist.'
            });
        }

        // Does the coauthor record exist?
        if (!publication.coAuthors.includes(event?.pathParameters.coauthor)) {
            return response.json(404, {
                message: 'This coauthor has not been added to this publication.'
            });
        }

        // Is this user the author of the publication?
        if (publication?.user.id !== event?.user.id) {
            return response.json(403, {
                message: 'You do not have the right permissions for this action.'
            });
        }

        await coAuthorService.deleteCoAuthor(event?.pathParameters.coauthor);

        return response.json(201, { message: 'Co-author deleted from this publication' });
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};
