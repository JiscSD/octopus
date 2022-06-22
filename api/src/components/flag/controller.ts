import nodemailer from 'nodemailer';
import * as response from 'lib/response';
import * as publicationService from 'publication/service';
import * as flagService from 'flag/service';
import * as userService from 'user/service';
import * as I from 'interface';
import * as helpers from 'lib/helpers';
import * as email from 'lib/email';

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
            return response.json(400, {
                message: 'An unresolved flag created by you, for this publication and category already exists.'
            });
        }

        const flag = await flagService.createFlag(
            event.pathParameters.id,
            event.user.id,
            event.body.category,
            event.body.comment
        );

        // send email to the author aka the creator of the flagged publication
        await email.newRedFlagAuthorNotification({
            to: publication.user.email || '',
            publicationName: publication.title,
            publicationId: publication.id,
            flagId: flag.id,
            type: helpers.formatFlagType(event.body.category),
            submitter: `${event.user.firstName} ${event.user.lastName || ''}`,
            flagReason: event.body.comment
        });

        // send email to the creator of the flag
        await email.newRedFlagCreatorNotification({
            to: event.user.email,
            publicationName: publication.title,
            publicationId: publication.id,
            flagId: flag.id
        });

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
        if (event.body.comment) {
            const isHTMLSafe = helpers.isHTMLSafe(event.body.comment);

            if (!isHTMLSafe) {
                return response.json(404, {
                    message:
                        'HTML is not safe, please check out the <a href="https://octopus.ac/api-documentation#content">API documentation.</a>'
                });
            }
        }

        const flag = await flagService.getFlag(event.pathParameters.id);

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

        const flagComment = await flagService.createFlagComment(
            event.pathParameters.id,
            event.body.comment,
            event.user.id
        );

        const publication = await publicationService.get(flag.publicationId);

        const flagCreator = await userService.get(flag.createdBy, true);

        // send email to the author aka the creator of the flagged publication and to the creator of the flag
        const emailPromises: Promise<nodemailer.SentMessageInfo>[] = [];
        if (publication?.user.email) {
            emailPromises.push(
                email.updateRedFlagNotification({
                    to: publication.user.email,
                    publicationName: publication?.title || '',
                    publicationId: publication?.id || '',
                    flagId: flag.id,
                    type: helpers.formatFlagType(flag.category),
                    submitter: `${event.user.firstName} ${event.user.lastName || ''}`
                })
            );
        }

        if (flagCreator?.email) {
            emailPromises.push(
                email.updateRedFlagNotification({
                    to: flagCreator.email,
                    publicationName: publication?.title || '',
                    publicationId: publication?.id || '',
                    flagId: flag.id,
                    type: helpers.formatFlagType(flag.category),
                    submitter: `${event.user.firstName} ${event.user.lastName || ''}`
                })
            );
        }

        // Send off notifications
        await Promise.all(emailPromises);

        return response.json(200, flagComment);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const resolveFlag = async (event: I.AuthenticatedAPIRequest<undefined, undefined, I.ResolveFlagPathParams>) => {
    try {
        const flag = await flagService.getFlag(event.pathParameters.id);

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

        const resolveFlag = await flagService.resolveFlag(event.pathParameters.id);

        const publication = await publicationService.get(flag.publicationId);

        // send email to the author aka the creator of the flagged publication
        await email.resolveRedFlagAuthorNotification({
            to: publication?.user.email || '',
            publicationName: publication?.title || '',
            publicationId: publication?.id || '',
            flagId: flag.id,
            type: helpers.formatFlagType(flag.category)
        });

        // send email to the creator of the flag
        await email.resolveRedFlagCreatorNotification({
            to: publication?.user.email || '',
            publicationName: publication?.title || '',
            publicationId: publication?.id || '',
            flagId: flag.id
        });

        return response.json(200, resolveFlag);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};
