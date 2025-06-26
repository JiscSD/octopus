import { Prisma } from '@prisma/client';
import * as coAuthorService from 'coAuthor/service';
import * as Helpers from 'lib/helpers';
import * as I from 'interface';
import * as email from 'email';
import * as linkService from 'link/service';
import * as response from 'lib/response';
import * as publicationVersionService from 'publicationVersion/service';

export const getAll = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.CreateCoAuthorPathParams>
): Promise<I.JSONResponse> => {
    try {
        const version = await publicationVersionService.privateGetById(event.pathParameters.publicationVersionId);

        if (!version) {
            return response.json(404, {
                message: 'This publication version does not exist.'
            });
        }

        if (
            !version.coAuthors.find((coAuthor) => coAuthor.linkedUser === event.user.id) &&
            version.user.id !== event.user.id
        ) {
            return response.json(403, {
                message: 'You do not have permission to view the co-authors of this publication version.'
            });
        }

        const coAuthors = version.coAuthors;

        // Redact emails of other co-authors unless the user is the corresponding author.
        const coAuthorsWithRedactedEmails =
            event.user.id === version.createdBy
                ? coAuthors
                : coAuthors.map((coAuthor) => {
                      if (coAuthor.linkedUser === event.user.id) {
                          return coAuthor;
                      } else {
                          const { email, ...rest } = coAuthor;

                          return rest;
                      }
                  });

        return response.json(200, coAuthorsWithRedactedEmails);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const updateAll = async (
    event: I.AuthenticatedAPIRequest<I.CoAuthor[], undefined, I.CreateCoAuthorPathParams>
): Promise<I.JSONResponse> => {
    try {
        const version = await publicationVersionService.privateGetById(event.pathParameters.publicationVersionId);

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

        // Check if corresponding author is trying to remove themselves
        if (removedCoAuthors.some((author) => author.linkedUser === event.user.id)) {
            return response.json(403, {
                message: 'You are not allowed to remove yourself from the publication version.'
            });
        }

        // Verify if any of the previously added co-authors have been removed
        if (removedCoAuthors.length) {
            // Notify co-authors that they've been removed (if their approval has been requested)
            for (const coAuthor of removedCoAuthors) {
                // Remove co-author from this publication
                await coAuthorService.deleteCoAuthorByEmail(version.id, coAuthor.email);

                if (coAuthor.approvalRequested) {
                    // Notify co-author that they've been removed
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

            // Remove any links to this publication that are made invalid by this change.
            await linkService.removeInvalidLinksForPublication(version.versionOf, 'to');
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
        const version = await publicationVersionService.privateGetById(event.pathParameters.publicationVersionId);

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
        if (!version.coAuthors.some((coAuthor) => coAuthor.id === event.pathParameters.coAuthorId)) {
            return response.json(404, {
                message: 'This coauthor has not been added to this publication version.'
            });
        }

        await coAuthorService.deleteCoAuthor(event.pathParameters.coAuthorId);

        // notify co-author that they've been removed
        await email.notifyCoAuthorRemoval({
            coAuthor: {
                email:
                    version.coAuthors.find((coAuthor) => coAuthor.id === event.pathParameters.coAuthorId)?.email || ''
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
        const version = await publicationVersionService.privateGetById(event.pathParameters.publicationVersionId);

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

export const updateCoAuthor = async (
    event: I.AuthenticatedAPIRequest<I.UpdateCoAuthorRequestBody, undefined, I.UpdateCoAuthorPathParams>
): Promise<I.JSONResponse> => {
    try {
        const version = await publicationVersionService.privateGetById(event.pathParameters.publicationVersionId);

        // Does the publication version exist?
        if (!version) {
            return response.json(404, {
                message: 'This publication version does not exist.'
            });
        }

        // Is the coauthor actually a coauthor of this publication version?
        const coAuthor = version.coAuthors.find((coAuthor) => coAuthor.id === event.pathParameters.coAuthorId);

        if (!coAuthor) {
            return response.json(404, {
                message: 'Co-author not found.'
            });
        }

        // Check if user is the coauthor in question
        if (coAuthor.linkedUser !== event.user.id) {
            return response.json(403, {
                message: "You cannot update another co-author's information."
            });
        }

        // Co-author records can't be updated on a live publication.
        if (version.currentStatus === 'LIVE') {
            return response.json(400, {
                message: 'Co-authors on a live publication version cannot be updated.'
            });
        }

        const isCorrespondingAuthor = version.user.id === coAuthor.linkedUser;
        const settingApproval = event.body.confirm !== undefined;
        const settingApprovalRetention = event.body.retainApproval !== undefined;

        // Non-corresponding authors cannot update themselves unless publication is locked.
        if (version.currentStatus === 'DRAFT' && !isCorrespondingAuthor) {
            return response.json(400, {
                message: 'This publication version is being edited, so you cannot update your information.'
            });
        }

        if (isCorrespondingAuthor && (settingApproval || settingApprovalRetention)) {
            return response.json(400, {
                message: 'Corresponding authors cannot change their approval status.'
            });
        }

        if (settingApproval) {
            // Approval can't be set without valid affiliation information.
            const sendingValidAffiliationStatus = event.body.isIndependent || event.body.affiliations?.length;
            const affiliationStatusAlreadySet = coAuthor.isIndependent || coAuthor.affiliations.length;

            if (!affiliationStatusAlreadySet && !sendingValidAffiliationStatus) {
                return response.json(400, {
                    message: 'Please fill out your affiliation information before submitting your approval.'
                });
            }

            const invalidatingAffiliations =
                (event.body.isIndependent === false && !coAuthor.affiliations.length) ||
                (!coAuthor.isIndependent && event.body.affiliations?.length === 0);

            if (affiliationStatusAlreadySet && invalidatingAffiliations) {
                return response.json(400, {
                    message:
                        'This change would unset your affiliation information, which is needed to set your approval.'
                });
            }
        }

        const settingAffiliationStatus =
            event.body.isIndependent !== undefined || event.body.affiliations !== undefined;

        if (settingAffiliationStatus) {
            if (event.body.isIndependent && event.body.affiliations?.length) {
                return response.json(400, {
                    message: 'You cannot be independent and also have affiliations.'
                });
            }

            if (coAuthor.confirmedCoAuthor && !isCorrespondingAuthor) {
                return response.json(400, {
                    message: 'You cannot change your affiliation information after approving the publication.'
                });
            }

            // Must provide some status if publication version is locked.
            if (!event.body.isIndependent && !event.body.affiliations?.length && version.currentStatus === 'LOCKED') {
                return response.json(400, {
                    message: 'Please either provide affiliations or declare your independence.'
                });
            }

            const hasDuplicateAffiliations =
                new Set(event.body.affiliations?.map((affiliation) => affiliation.id)).size !==
                event.body.affiliations?.length;

            if (hasDuplicateAffiliations) {
                return response.json(400, { message: 'Duplicate affiliations found.' });
            }
        }

        // update coAuthor confirmation status
        const updateData: Prisma.CoAuthorsUpdateInput = {
            confirmedCoAuthor: event.body.confirm,
            retainApproval: event.body.retainApproval,
            isIndependent: event.body.isIndependent,
            affiliations: (event.body.affiliations as unknown[] as Prisma.InputJsonValue[]) || undefined
        };
        await coAuthorService.update(coAuthor.id, updateData);

        if (settingApproval) {
            if (event.body.confirm === true) {
                // notify main author about confirmation
                await email.notifyCoAuthorConfirmation({
                    coAuthor: {
                        fullName: Helpers.getUserFullName(event.user)
                    },
                    publication: {
                        authorEmail: version.user.email || '',
                        title: version.title || '',
                        url: Helpers.getPublicationUrl(version.versionOf)
                    },
                    remainingConfirmationsCount:
                        version.coAuthors.filter((coAuthor) => !coAuthor.confirmedCoAuthor).length - 1
                });
            }

            // Handle coauthor retracting their approval.
            if (coAuthor.confirmedCoAuthor && event.body.confirm === false) {
                await email.notifyCoAuthorCancelledApproval({
                    publication: {
                        id: version.versionOf,
                        title: version.title || '',
                        authorEmail: version.user.email || '',
                        url: Helpers.getPublicationUrl(version.versionOf)
                    }
                });
            }
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
        const version = await publicationVersionService.privateGetById(versionId);

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

            if (!isReadyToRequestApprovals.ready) {
                return response.json(400, {
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
                    if (!linkedCoAuthor.retainApproval) {
                        await email.notifyCoAuthorsAboutChanges({
                            coAuthor: { email: linkedCoAuthor.email },
                            publication: {
                                title: version.title || '',
                                url: Helpers.getPublicationUrl(version.versionOf)
                            }
                        });
                    }
                }
            }
        }

        // get all pending co authors
        const pendingCoAuthors = await coAuthorService.getPendingApprovalForPublicationVersion(version.id);

        // email pending co authors and update their record
        for (const pendingCoAuthor of pendingCoAuthors) {
            await email.notifyCoAuthor({
                coAuthor: pendingCoAuthor.email,
                userFullName: Helpers.getUserFullName(event.user),
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
    const { coAuthorId, publicationVersionId } = event.pathParameters;

    const version = await publicationVersionService.getById(publicationVersionId);
    const author = await coAuthorService.get(coAuthorId);

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
                creator: Helpers.getUserFullName(version.user),
                versionId: version.id
            }
        });

        // update co-author reminderDate
        await coAuthorService.update(coAuthorId, { reminderDate: new Date() });
    } catch (error) {
        console.log(error);

        return response.json(500, { message: 'Unknown server error' });
    }

    return response.json(200, { message: `Reminder sent to ${author.email}` });
};
