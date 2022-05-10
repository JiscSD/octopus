import * as response from 'lib/response';
import * as publicationService from 'publication/service';
import * as flagService from 'flag/service';
import * as I from 'interface';

export const get = async (event: I.APIRequest<undefined, undefined, I.GetFlagByID>) => {
    try {
        const flag = await flagService.get(event.pathParameters.id);
        return response.json(200, flag);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const getPublicationFlags = async (event: I.APIRequest<undefined, undefined, I.GetFlagsByPublicationID>) => {
    try {
        const flags = await flagService.getByPublicationID(event.pathParameters.id);
        return response.json(200, flags);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const getUserFlags = async (event: I.APIRequest<undefined, undefined, I.GetFlagsByUserID>) => {
    try {
        const flags = await flagService.getByUserID(event.pathParameters.id);
        return response.json(200, flags);
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

        const doesDuplicateFlagExist = await publicationService.doesDuplicateFlagExist(
            event.pathParameters.id,
            event.body.category,
            event.user.id
        );

        if (doesDuplicateFlagExist) {
            return response.json(404, {
                message: 'An unresolved flag created by you, for this publication and category already exists.'
            });
        }

        const flag = await publicationService.createFlag(
            event.pathParameters.id,
            event.user.id,
            event.body.category,
            event.body.comment
        );

        return response.json(200, flag);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const createFlagComment = async (
    event: I.AuthenticatedAPIRequest<I.CreateFlagCommentBody, undefined, I.CreateFlagCommentPathParams>
) => {
    try {
        const flag = await publicationService.getFlag(event.pathParameters.id);

        if (!flag) {
            return response.json(404, {
                message: 'This flag does not exist.'
            });
        }

        if (flag.resolved) {
            return response.json(403, {
                message: 'You cannot comment on a flag that has already been resolved.'
            });
        }

        // The user attempting to leave a comment, is not the flag creator, or the publication owner
        if (flag.createdBy !== event.user.id && flag.publication.user.id !== event.user.id) {
            return response.json(403, {
                message: 'You do not have permission to comment on this flag.'
            });
        }

        const flagComment = await publicationService.createFlagComment(
            event.pathParameters.id,
            event.body.comment,
            event.user.id
        );

        return response.json(200, flagComment);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const resolveFlag = async (event: I.AuthenticatedAPIRequest<undefined, undefined, I.ResolveFlagPathParams>) => {
    try {
        const flag = await publicationService.getFlag(event.pathParameters.id);

        if (!flag) {
            return response.json(404, {
                message: 'This flag does not exist.'
            });
        }

        if (flag.createdBy !== event.user.id && event.user.role !== 'SUPER_USER') {
            return response.json(403, {
                message: 'You do not have permission to resolve this flag.'
            });
        }

        if (flag.resolved) {
            return response.json(403, {
                message: 'This flag has already been resolved.'
            });
        }

        const resolveFlag = await publicationService.resolveFlag(event.pathParameters.id);

        return response.json(200, resolveFlag);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};
