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
        console.log(err);

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
        const authorEmails = event.body.map((coAuthor) => coAuthor.email.toLowerCase());
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
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const link = async (
    event: I.OptionalAuthenticatedAPIRequest<I.ConfirmCoAuthorBody, undefined, I.ConfirmCoAuthorPathParams>
): Promise<I.JSONResponse> => {
    try {
        const publication = await publicationService.get(event.pathParameters.id);

        if (!publication) {
            return response.json(404, {
                message: 'This publication does not exist.'
            });
        }

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

            // check if this was the last co-author who denied their involvement
            if (publication.coAuthors.length === 2) {
                // this means only the creator remained and we can safely update publication status back to DRAFT
                // to avoid publication being LOCKED without co-authors
                await publicationService.updateStatus(publication.id, 'DRAFT', false);
            }

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
        console.log(err);

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

        // Is the publication in locked mode?
        if (publication.currentStatus !== 'LOCKED') {
            return response.json(403, {
                message:
                    publication.currentStatus === 'LIVE'
                        ? 'You cannot approve a LIVE publication'
                        : 'This publication is not ready for review yet'
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
        console.log(err);

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

        if (publication.currentStatus === 'LIVE') {
            return response.json(403, { message: 'Cannot request approvals for a LIVE publication.' });
        }

        // check if user is not the corresponding author
        if (event.user.id !== publication.createdBy) {
            return response.json(403, {
                message: 'You are not allowed to request approvals for this publication.'
            });
        }

        // check if publication actually has co-authors
        if (publication.coAuthors.length < 2) {
            return response.json(403, { message: 'There is no co-author to request approval from.' });
        }

        if (publication.currentStatus === 'DRAFT') {
            // check if publication was LOCKED before
            if (publication.publicationStatus.some(({ status }) => status === 'LOCKED')) {
                // notify linked co-authors about changes
                const linkedCoAuthors = publication.coAuthors.filter(
                    (author) => author.linkedUser && author.linkedUser !== publication.createdBy
                );

                for (const linkedCoAuthor of linkedCoAuthors) {
                    await email.notifyCoAuthorsAboutChanges({
                        coAuthor: { email: linkedCoAuthor.email },
                        publication: {
                            title: publication.title || '',
                            url: `${process.env.BASE_URL}/publications/${publication.id}`
                        }
                    });
                }
            }
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
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const sendApprovalReminder = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.SendApprovalReminderPathParams>
): Promise<I.JSONResponse> => {
    const { coauthor: authorId, id: publicationId } = event.pathParameters;

    const publication = await publicationService.get(publicationId);
    const author = await coAuthorService.get(authorId);

    if (!publication) {
        return response.json(404, {
            message: 'This publication does not exist.'
        });
    }

    // Can only send reminder on publications that have been locked for review
    if (publication.currentStatus !== 'LOCKED') {
        return response.json(403, {
            message: 'A reminder is not able to be sent unless approval is being requested'
        });
    }

    if (event.user.id !== publication.createdBy) {
        return response.json(403, {
            message: 'You do not have the right permissions for this action.'
        });
    }

    if (!author || author.publicationId !== publicationId) {
        return response.json(404, {
            message: 'This author does not exist on this publication'
        });
    }

    /**
     * @TODO - discuss with the team changing from 'confirmedCoAuthor' to 'approved' because it's really confusing
     * confirmed means they confirmed their involvement but they didn't approve the publication to go live yet
     * approved means they approved the publication after confirming their involvement
     */
    if (author.confirmedCoAuthor) {
        return response.json(400, {
            message: 'This author has already approved this publication'
        });
    }

    if (author.linkedUser) {
        // the co-author accepted the invitation but he didn't approve yet
        return response.json(400, {
            message: 'This author has already accepted your invitation'
        });
    }

    if (author.reminderDate) {
        return response.json(400, {
            message: 'You have already sent a reminder to this author'
        });
    }

    try {
        // send reminder
        await email.sendApprovalReminder({
            coAuthor: { email: author.email, code: author.code },
            publication: {
                id: publicationId,
                title: publication.title || '',
                creator: `${publication.user.firstName} ${publication.user.lastName}`
            }
        });

        // update co-author reminderDate
        await coAuthorService.update(authorId, { reminderDate: new Date() });
    } catch (error) {
        console.log(error);

        return response.json(500, { message: 'Unknown server error' });
    }

    return response.json(200, { message: `Reminder sent to ${author.email}` });
};
