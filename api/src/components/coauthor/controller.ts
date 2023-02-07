import * as coAuthorService from 'coauthor/service';
import * as I from 'interface';
import * as email from 'email';
import * as response from 'lib/response';
import * as publicationService from 'publication/service';

export const get = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.CreateCoAuthorPathParams>
): Promise<I.JSONResponse> => {
    try {
        const coAuthors = await coAuthorService.getAllByPublication(event.pathParameters.id);

        return response.json(200, coAuthors);
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const updateAll = async (
    event: I.AuthenticatedAPIRequest<I.CoAuthor[], undefined, I.CreateCoAuthorPathParams>
): Promise<I.JSONResponse> => {
    try {
        const publicationId = event.pathParameters.id;
        const publication = await publicationService.get(publicationId);

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

        // Check if duplicate coAuthors in array
        const authorEmails = event.body.map((coAuthor) => coAuthor.email);
        const isDuplicate = authorEmails.some((coAuthor, index) => authorEmails.indexOf(coAuthor) != index);

        if (isDuplicate) {
            return response.json(400, { message: 'Duplicate coAuthors' });
        }

        const newCoAuthorsArray = event.body;
        const oldCoAuthorsArray = publication.coAuthors;
        const removedCoAuthors = oldCoAuthorsArray.filter(
            (oldCoAuthor) => !newCoAuthorsArray.find((newCoAuthor) => oldCoAuthor.email === newCoAuthor.email)
        );

        // check if corresponding author is trying to remove himself
        if (removedCoAuthors.some((author) => author.linkedUser === event.user.id)) {
            return response.json(403, {
                message: 'You are not allowed to remove yourself from the publication.'
            });
        }

        // verify if any of the previously added co-authors have been removed
        if (removedCoAuthors.length) {
            // notify co-authors that they've been removed (if their approval has been requested)
            for (const coAuthor of removedCoAuthors) {
                // remove co-author from this publication
                await coAuthorService.deleteCoAuthorByEmail(coAuthor.publicationId, coAuthor.email);

                if (coAuthor.approvalRequested) {
                    // notify co-author that they've been removed
                    await email.notifyCoAuthorRemoval({
                        coAuthor: {
                            email: coAuthor.email
                        },
                        publication: {
                            title: publication.title || ''
                        }
                    });
                }
            }
        }

        await coAuthorService.updateAll(publicationId, newCoAuthorsArray);

        return response.json(200, 'Successfully updated publication authors');
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const remove = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.DeleteCoAuthorPathParams>
): Promise<I.JSONResponse> => {
    try {
        const publication = await publicationService.get(event.pathParameters.id);

        // Does the publication exist?
        if (!publication) {
            return response.json(404, {
                message: 'This publication does not exist.'
            });
        }

        // Is this user the author of the publication?
        if (publication.user.id !== event.user.id) {
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

        // Is the coauthor actually a coauthor of this publication
        if (!publication.coAuthors.some((coAuthor) => coAuthor.id === event.pathParameters.coauthor)) {
            return response.json(404, {
                message: 'This coauthor has not been added to this publication.'
            });
        }

        await coAuthorService.deleteCoAuthor(event.pathParameters.coauthor);

        // notify co-author that they've been removed
        await email.notifyCoAuthorRemoval({
            coAuthor: {
                email:
                    publication.coAuthors.find((coAuthor) => coAuthor.id === event.pathParameters.coauthor)?.email || ''
            },
            publication: {
                title: publication.title || ''
            }
        });

        return response.json(200, { message: 'Co-author deleted from this publication' });
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const link = async (
    event: I.OptionalAuthenticatedAPIRequest<I.ConfirmCoAuthorBody, undefined, I.ConfirmCoAuthorPathParams>
): Promise<I.JSONResponse> => {
    try {
        const publication = await publicationService.get(event.pathParameters.id);

        // Does the publication exist?
        if (!publication) {
            return response.json(404, {
                message: 'This publication does not exist.'
            });
        }

        // Is the publication in draft?
        if (publication.currentStatus === 'LIVE') {
            return response.json(403, {
                message: 'This publication is LIVE and therefore cannot be edited.'
            });
        }

        const coAuthorByEmail = publication.coAuthors.find((coAuthor) => coAuthor.email === event.body.email);
        // check if this user is part of co-authors list
        if (!coAuthorByEmail) {
            return response.json(403, { message: 'You are not currently listed as an author on this draft' });
        }

        if (!event.body.approve) {
            // email has already been linked
            if (coAuthorByEmail.linkedUser) {
                return response.json(404, {
                    message:
                        'You have previously verified your involvement. Please contact the submitting author to be removed from this publication.'
                });
            }

            await coAuthorService.removeFromPublication(event.pathParameters.id, event.body.email, event.body.code);

            // notify main author about rejection
            await email.notifyCoAuthorRejection({
                coAuthor: {
                    email: event.body.email
                },
                publication: {
                    title: publication.title || '',
                    authorEmail: publication.user.email || ''
                }
            });

            return response.json(200, 'Removed co-author from publication');
        }

        if (!event.user) {
            return response.json(403, {
                message: 'To link yourself as a co-author, you must be logged in.'
            });
        }

        // Cannot link user without a verified email address
        if (!event.user.email) {
            return response.json(403, {
                message: 'To link yourself as a co-author, you must have a verified email address.'
            });
        }

        // Cannot link user to co-author if it is the owner
        if (publication.user.id === event.user.id) {
            return response.json(404, {
                message: 'You cannot link yourself as the co-author, if you are the creator.'
            });
        }

        // User is already linked as a co-author
        if (publication.coAuthors.some((coAuthor) => coAuthor.linkedUser === event.user?.id)) {
            return response.json(404, {
                message: 'You are already linked as an author on this draft'
            });
        }

        // email has already been linked
        if (coAuthorByEmail.linkedUser) {
            return response.json(404, {
                message: 'User has already been linked to this publication.'
            });
        }

        await coAuthorService.linkUser(event.user.id, event.pathParameters.id, event.body.email, event.body.code);

        return response.json(200, 'Linked user account');
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const updateConfirmation = async (
    event: I.AuthenticatedAPIRequest<I.ChangeCoAuthorRequestBody, undefined, I.UpdateCoAuthorPathParams>
): Promise<I.JSONResponse> => {
    try {
        const publication = await publicationService.get(event.pathParameters.id);

        // Does the publication exist?
        if (!publication) {
            return response.json(404, {
                message: 'This publication does not exist.'
            });
        }

        // Is the publication in draft?
        if (publication.currentStatus === 'LIVE') {
            return response.json(403, {
                message: 'This publication is LIVE and therefore cannot be edited.'
            });
        }

        // Is the coauthor actually a coauthor of this publication
        if (!publication.coAuthors.some((coAuthor) => coAuthor.linkedUser === event.user.id)) {
            return response.json(403, {
                message: 'You are not a co-author of this publication.'
            });
        }

        // update coAuthor confirmation status
        await coAuthorService.updateConfirmation(event.pathParameters.id, event.user.id, event.body.confirm);

        if (event.body.confirm) {
            // notify main author about confirmation
            await email.notifyCoAuthorConfirmation({
                coAuthor: {
                    firstName: event.user.firstName,
                    lastName: event.user.lastName || ''
                },
                publication: {
                    authorEmail: publication.user.email || '',
                    title: publication.title || '',
                    url: `${process.env.BASE_URL}/publications/${publication.id}`
                },
                remainingConfirmationsCount:
                    publication.coAuthors.filter((coAuthor) => !coAuthor.confirmedCoAuthor).length - 1
            });
        } else {
            // notify main author about rejection
            await email.notifyCoAuthorRejection({
                coAuthor: {
                    email: event.user.email || ''
                },
                publication: {
                    title: publication.title || '',
                    authorEmail: publication.user.email || ''
                }
            });
        }

        return response.json(200, { message: 'This co-author has changed their confirmation status.' });
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const requestApproval = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.CreateCoAuthorPathParams>
): Promise<I.JSONResponse> => {
    try {
        const publicationId = event.pathParameters.id;
        const publication = await publicationService.get(publicationId);

        if (!publication) {
            return response.json(404, { message: 'Publication not found' });
        }

        // get all pending co authors
        const pendingCoAuthors = await coAuthorService.getPendingApprovalForPublication(publicationId);

        // email pending co authors and update their record
        for (const pendingCoAuthor of pendingCoAuthors) {
            await email.notifyCoAuthor({
                coAuthor: pendingCoAuthor.email,
                userFirstName: event.user.firstName,
                userLastName: event.user.lastName,
                code: pendingCoAuthor.code,
                publicationId,
                publicationTitle: publication?.title || 'No title yet'
            });

            await coAuthorService.updateRequestApprovalStatus(publicationId, pendingCoAuthor.email);
        }

        const coAuthors = await coAuthorService.getAllByPublication(publicationId);

        return response.json(200, coAuthors);
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};
