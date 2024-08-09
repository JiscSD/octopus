import * as coAuthorService from 'coAuthor/service';
import * as I from 'interface';
import * as email from 'email';
import * as response from 'lib/response';
import * as publicationVersionService from 'publicationVersion/service';

export const get = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.CreateCoAuthorPathParams>
): Promise<I.JSONResponse> => {
    try {
        const version = await publicationVersionService.getById(event.pathParameters.publicationVersionId);

        if (!version) {
            return response.json(404, {
                message: 'This publication version does not exist.'
            });
        }

        const coAuthors = version.coAuthors;

        const correspondingAuthor = coAuthors.find((coAuthor) => coAuthor.linkedUser === version.createdBy);

        // enforce adding corresponding author if it's missing - this will fix old publications which don't have the corresponding author in the coAuthors list
        if (!correspondingAuthor) {
            const correspondingAuthor = await coAuthorService.createCorrespondingAuthor(version);

            // put corresponding author in the first position
            coAuthors.unshift({
                ...correspondingAuthor,
                user: {
                    firstName: version.user.firstName,
                    lastName: version.user.lastName,
                    orcid: version.user.orcid,
                    role: version.user.role,
                    url: version.user.url
                }
            });
        }

        return response.json(200, version.coAuthors);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const updateAll = async (
    event: I.AuthenticatedAPIRequest<I.CoAuthor[], undefined, I.CreateCoAuthorPathParams>
): Promise<I.JSONResponse> => {
    try {
        const version = await publicationVersionService.getById(event.pathParameters.publicationVersionId);

        // Does the publication version exist?
        if (!version) {
            return response.json(404, {
                message: 'This publication version does not exist.'
            });
        }

        // Is this user the author of this version of the publication?
        if (version.user.id !== event?.user.id) {
            return response.json(403, {
                message: 'You do not have the right permissions for this action.'
            });
        }

        // Is the current version of the publication not live?
        if (version.currentStatus === 'LIVE') {
            return response.json(400, {
                message: 'This publication version is LIVE and therefore cannot be edited.'
            });
        }

        // Check if duplicate coAuthors in array
        const authorEmails = event.body.map((coAuthor) => coAuthor.email.toLowerCase());
        const isDuplicate = authorEmails.some((coAuthor, index) => authorEmails.indexOf(coAuthor) != index);

        if (isDuplicate) {
            return response.json(400, {
                message: 'Duplicate co-authors supplied. Make sure all email addresses are unique.'
            });
        }

        const newCoAuthorsArray = event.body;
        const oldCoAuthorsArray = version.coAuthors;
        const removedCoAuthors = oldCoAuthorsArray.filter(
            (oldCoAuthor) => !newCoAuthorsArray.find((newCoAuthor) => oldCoAuthor.email === newCoAuthor.email)
        );

        // check if corresponding author is trying to remove themselves
        if (removedCoAuthors.some((author) => author.linkedUser === event.user.id)) {
            return response.json(403, {
                message: 'You are not allowed to remove yourself from the publication version.'
            });
        }

        // verify if any of the previously added co-authors have been removed
        if (removedCoAuthors.length) {
            // notify co-authors that they've been removed (if their approval has been requested)
            for (const coAuthor of removedCoAuthors) {
                // remove co-author from this publication
                await coAuthorService.deleteCoAuthorByEmail(version.id, coAuthor.email);

                if (coAuthor.approvalRequested) {
                    // notify co-author that they've been removed
                    await email.notifyCoAuthorRemoval({
                        coAuthor: {
                            email: coAuthor.email
                        },
                        publication: {
                            title: version.title || ''
                        }
                    });
                }
            }
        }

        await coAuthorService.updateAll(version.id, newCoAuthorsArray);

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
        const version = await publicationVersionService.getById(event.pathParameters.publicationVersionId);

        // Does the publication version exist?
        if (!version) {
            return response.json(404, {
                message: 'This publication version does not exist.'
            });
        }

        // Is this user the author of this version of the publication?
        if (version.user.id !== event.user.id) {
            return response.json(403, {
                message: 'You do not have the right permissions for this action.'
            });
        }

        // Is the current version of the publication not live?
        if (version.currentStatus === 'LIVE') {
            return response.json(400, {
                message: 'This publication version is LIVE and therefore cannot be edited.'
            });
        }

        // Is the coauthor actually a coauthor of this version of the publication
        if (!version.coAuthors.some((coAuthor) => coAuthor.id === event.pathParameters.coauthorId)) {
            return response.json(404, {
                message: 'This coauthor has not been added to this publication version.'
            });
        }

        await coAuthorService.deleteCoAuthor(event.pathParameters.coauthorId);

        // notify co-author that they've been removed
        await email.notifyCoAuthorRemoval({
            coAuthor: {
                email:
                    version.coAuthors.find((coAuthor) => coAuthor.id === event.pathParameters.coauthorId)?.email || ''
            },
            publication: {
                title: version.title || ''
            }
        });

        return response.json(200, { message: 'Co-author deleted from this publication' });
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const link = async (
    event: I.OptionalAuthenticatedAPIRequest<I.ConfirmCoAuthorBody, undefined, I.LinkCoAuthorPathParams>
): Promise<I.JSONResponse> => {
    try {
        const version = await publicationVersionService.getById(event.pathParameters.publicationVersionId);

        if (!version) {
            return response.json(404, {
                message: 'This publication version does not exist.'
            });
        }

        if (version.currentStatus === 'LIVE') {
            return response.json(400, {
                message: 'This publication version is LIVE and therefore cannot be edited.'
            });
        }

        const coAuthorByEmail = version.coAuthors.find((coAuthor) => coAuthor.email === event.body.email);

        // check if this user is part of co-authors list
        if (!coAuthorByEmail) {
            return response.json(403, { message: 'You are not currently listed as an author on this draft' });
        }

        // The requestor must either supply a code or log in as a verified user with the same email as the co-author record.
        const emailMatch = event.user?.email === coAuthorByEmail.email;

        if (!(emailMatch || event.body.code)) {
            return response.json(400, {
                message:
                    'To confirm or deny your involvement, you must either provide a code or be authenticated as a user with a verified email matching the co-author record.'
            });
        }

        if (!event.body.approve) {
            // check if user has already been linked
            if (coAuthorByEmail.linkedUser) {
                return response.json(404, {
                    message:
                        'You have previously verified your involvement. Please contact the submitting author to be removed from this publication.'
                });
            }

            await coAuthorService.removeFromPublicationVersion(version.id, event.body.email);

            // notify main author about rejection
            await email.notifyCoAuthorRejection({
                coAuthor: {
                    email: event.body.email
                },
                publication: {
                    title: version.title || '',
                    authorEmail: version.user.email || ''
                }
            });

            // check if this was the last co-author who denied their involvement
            if (version.coAuthors.length === 2) {
                // this means only the creator remained and we can safely update publication status back to DRAFT
                // to avoid version being LOCKED without co-authors
                await publicationVersionService.updateStatus(version.id, 'DRAFT');
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

        // Cannot link user to co-author if it is the author of the current version
        if (version.user.id === event.user.id) {
            return response.json(404, {
                message: 'You cannot link yourself as a co-author if you are already the corresponding author.'
            });
        }

        // User is already linked as a co-author
        if (version.coAuthors.some((coAuthor) => coAuthor.linkedUser === event.user?.id)) {
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

        await coAuthorService.linkUser(event.user.id, version.id, event.body.email);

        // The email of the linked user may not match the email the invitation was sent to
        // (e.g. user manages their orcid account with a different email to their work email).
        // In this case, we need to update the coauthor's email field because it becomes outdated.
        if (!emailMatch) {
            // We already check that the logged in user's email is not already a coauthor on this version,
            // so this is safe.
            await coAuthorService.update(coAuthorByEmail.id, { email: event.user.email });
        }

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
        const version = await publicationVersionService.getById(event.pathParameters.publicationVersionId);

        // Does the publication version exist?
        if (!version) {
            return response.json(404, {
                message: 'This publication version does not exist.'
            });
        }

        // Is the publication's current version in locked mode?
        if (version.currentStatus !== 'LOCKED') {
            return response.json(400, {
                message:
                    version.currentStatus === 'LIVE'
                        ? 'You cannot approve a LIVE publication version'
                        : 'This publication version is not ready for review yet'
            });
        }

        const coAuthor = version.coAuthors.find((coAuthor) => coAuthor.linkedUser === event.user.id);

        // Is the coauthor actually a coauthor of this publication version
        if (!coAuthor) {
            return response.json(403, {
                message: 'You are not a co-author of this publication version.'
            });
        }

        // check if coauthor confirmed their affiliations
        if (!(coAuthor.isIndependent || coAuthor.affiliations.length)) {
            return response.json(403, {
                message: 'Please fill out your affiliation information.'
            });
        }

        // update coAuthor confirmation status
        await coAuthorService.updateConfirmation(version.id, event.user.id, event.body.confirm);

        if (event.body.confirm) {
            // notify main author about confirmation
            await email.notifyCoAuthorConfirmation({
                coAuthor: {
                    firstName: event.user.firstName,
                    lastName: event.user.lastName || ''
                },
                publication: {
                    authorEmail: version.user.email || '',
                    title: version.title || '',
                    url: `${process.env.BASE_URL}/publications/${version.versionOf}`
                },
                remainingConfirmationsCount:
                    version.coAuthors.filter((coAuthor) => !coAuthor.confirmedCoAuthor).length - 1
            });
        } else {
            // notify corresponding author about cancelled approval
            await email.notifyCoAuthorCancelledApproval({
                publication: {
                    id: version.versionOf,
                    title: version.title || '',
                    authorEmail: version.user.email || '',
                    url: `${process.env.BASE_URL}/publications/${version.versionOf}`
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
        const versionId = event.pathParameters.publicationVersionId;
        const version = await publicationVersionService.getById(versionId);

        if (!version) {
            return response.json(404, { message: 'Publication version not found' });
        }

        if (version.currentStatus === 'LIVE') {
            return response.json(400, { message: 'Cannot request approvals for a LIVE publication version.' });
        }

        // check if user is not the corresponding author
        if (event.user.id !== version.createdBy) {
            return response.json(403, {
                message: 'You are not allowed to request approvals for this publication version.'
            });
        }

        // check if publication actually has co-authors
        if (version.coAuthors.length < 2) {
            return response.json(403, { message: 'There is no co-author to request approval from.' });
        }

        if (version.currentStatus === 'DRAFT') {
            const isReadyToRequestApprovals = await publicationVersionService.checkIsReadyToRequestApprovals(version);

            if (!isReadyToRequestApprovals) {
                return response.json(403, {
                    message:
                        'Approval emails cannot be sent because the publication is not ready to be LOCKED. Make sure all fields are filled in.'
                });
            }

            // check if this version was LOCKED before
            if (version.publicationStatus.some(({ status }) => status === 'LOCKED')) {
                // notify linked co-authors about changes
                const linkedCoAuthors = version.coAuthors.filter(
                    (author) => author.linkedUser && author.linkedUser !== version.createdBy
                );

                for (const linkedCoAuthor of linkedCoAuthors) {
                    await email.notifyCoAuthorsAboutChanges({
                        coAuthor: { email: linkedCoAuthor.email },
                        publication: {
                            title: version.title || '',
                            url: `${process.env.BASE_URL}/publications/${version.versionOf}`
                        }
                    });
                }
            }
        }

        // get all pending co authors
        const pendingCoAuthors = await coAuthorService.getPendingApprovalForPublicationVersion(version.id);

        // email pending co authors and update their record
        for (const pendingCoAuthor of pendingCoAuthors) {
            await email.notifyCoAuthor({
                coAuthor: pendingCoAuthor.email,
                userFirstName: event.user.firstName,
                userLastName: event.user.lastName,
                code: pendingCoAuthor.code,
                publicationId: version.versionOf,
                versionId: version.id,
                publicationTitle: version.title || 'No title yet'
            });

            await coAuthorService.updateRequestApprovalStatus(version.id, pendingCoAuthor.email);
        }

        const coAuthors = await coAuthorService.getAllByPublicationVersion(version.id);

        return response.json(200, coAuthors);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const sendApprovalReminder = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.SendApprovalReminderPathParams>
): Promise<I.JSONResponse> => {
    const { coauthorId, publicationVersionId } = event.pathParameters;

    const version = await publicationVersionService.getById(publicationVersionId);
    const author = await coAuthorService.get(coauthorId);

    if (!version) {
        return response.json(404, {
            message: 'This publication version does not exist.'
        });
    }

    // Can only send reminder on publication versions that have been locked for review
    if (version.currentStatus !== 'LOCKED') {
        return response.json(400, {
            message: 'A reminder is not able to be sent unless approval is being requested'
        });
    }

    if (event.user.id !== version.createdBy) {
        return response.json(403, {
            message: 'You do not have the right permissions for this action.'
        });
    }

    if (!author || author.publicationVersionId !== version.id) {
        return response.json(404, {
            message: 'This author does not exist on this publication version'
        });
    }

    /**
     * @TODO - discuss with the team changing from 'confirmedCoAuthor' to 'approved' because it's really confusing
     * confirmed means they confirmed their involvement but they didn't approve the publication to go live yet
     * approved means they approved the publication after confirming their involvement
     */
    if (author.confirmedCoAuthor) {
        return response.json(400, {
            message: 'This author has already approved this publication version'
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
                id: version.versionOf,
                title: version.title || '',
                creator: `${version.user.firstName} ${version.user.lastName}`,
                versionId: version.id
            }
        });

        // update co-author reminderDate
        await coAuthorService.update(coauthorId, { reminderDate: new Date() });
    } catch (error) {
        console.log(error);

        return response.json(500, { message: 'Unknown server error' });
    }

    return response.json(200, { message: `Reminder sent to ${author.email}` });
};
