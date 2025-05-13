import * as I from 'interface';
import * as response from 'lib/response';
import * as publicationVersionService from 'publicationVersion/service';
import * as publicationService from 'publication/service';
import * as coAuthorService from 'coAuthor/service';
import * as userService from 'user/service';
import * as Helpers from 'lib/helpers';
import * as eventService from 'event/service';
import * as email from 'lib/email';

export const get = async (
    event: I.APIRequest<undefined, undefined, I.GetPublicationVersionPathParams>
): Promise<I.JSONResponse> => {
    const { publicationId, version } = event.pathParameters;

    try {
        let publicationVersion = await publicationVersionService.get(publicationId, version);

        if (!publicationVersion) {
            return response.json(404, {
                message: 'Publication version not found.'
            });
        }

        const isCorrespondingAuthor = event.user?.id === publicationVersion.user.id;

        // If this is being requested by the corresponding author, include private data (including co-author emails).
        if (isCorrespondingAuthor) {
            const privateVersion = await publicationVersionService.privateGet(publicationId, version);

            if (privateVersion) {
                publicationVersion = privateVersion;
            }
        }

        // anyone can see a LIVE publication
        if (publicationVersion.currentStatus === 'LIVE') {
            return response.json(200, publicationVersion);
        }

        // only the owner or co-authors can view a DRAFT publication version
        if (
            !(
                isCorrespondingAuthor ||
                publicationVersion.coAuthors.some((coAuthor) => coAuthor.linkedUser === event.user?.id)
            )
        ) {
            // if client requested the "latest" version but user doesn't have permissions to see it
            // return the latest published version instead, if exists
            if (version === 'latest' && publicationVersion.versionNumber > 1) {
                const latestPublishedVersion = await publicationVersionService.get(publicationId, 'latestLive');

                return response.json(200, latestPublishedVersion);
            }

            return response.json(403, {
                message: 'You do not have permission to view this publication version.'
            });
        }

        // map "draft" topics before sending the response to the client
        let inheritedTopicIds: string[] = [];

        if (publicationVersion.versionNumber > 1) {
            const latestPublishedVersion = await publicationVersionService.get(publicationId, 'latestLive');

            if (latestPublishedVersion) {
                inheritedTopicIds = latestPublishedVersion.topics.map((topic) => topic.id);
            }
        }

        publicationVersion.topics = publicationVersion.topics.map((topic) => ({
            ...topic,
            draft: !inheritedTopicIds.includes(topic.id)
        }));

        return response.json(200, publicationVersion);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const getAll = async (
    event: I.AuthenticatedAPIRequest<undefined, I.GetPublicationVersionsQueryParams>
): Promise<I.JSONResponse> => {
    try {
        if (event.queryStringParameters.format === 'reporting') {
            // Reject incompatible query parameters.
            const compatibleParams: Array<keyof I.GetPublicationVersionsQueryParams> = [
                'limit',
                'offset',
                'format',
                'authorType',
                'dateFrom',
                'dateTo'
            ];

            for (const param of Object.keys(event.queryStringParameters)) {
                if (!compatibleParams.includes(param as keyof I.GetPublicationVersionsQueryParams)) {
                    return response.json(400, {
                        message: `The query parameter "${param}" is not compatible with the "reporting" format.`
                    });
                }
            }

            const responseData = await publicationVersionService.getAllForReporting(event.queryStringParameters);

            return response.json(200, responseData);
        } else {
            const openSearchPublications = await publicationService.getOpenSearchPublications(
                event.queryStringParameters
            );

            const publicationIds: string[] = openSearchPublications.body.hits.hits.map((hit) => hit._id as string);

            const publicationVersions = await publicationVersionService.getAllByPublicationIds(publicationIds);

            const versionsOrderedBySearch = publicationIds.map((publicationId) =>
                publicationVersions.find((version) => version.versionOf === publicationId)
            );

            return response.json(200, {
                data: versionsOrderedBySearch,
                metadata: {
                    total: openSearchPublications.body.hits.total.value,
                    limit: Number(event.queryStringParameters.limit) || 10,
                    offset: Number(event.queryStringParameters.offset) || 0
                }
            });
        }
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const update = async (
    event: I.AuthenticatedAPIRequest<
        I.UpdatePublicationVersionRequestBody,
        undefined,
        I.UpdatePublicationVersionPathParams
    >
): Promise<I.JSONResponse> => {
    try {
        const publicationVersion = await publicationVersionService.getById(event.pathParameters.publicationVersionId);

        if (!publicationVersion) {
            return response.json(404, {
                message: 'This publication version does not exist.'
            });
        }

        if (publicationVersion.user.id !== event.user.id) {
            return response.json(403, {
                message: 'You do not have permission to modify this publication version.'
            });
        }

        if (publicationVersion.currentStatus !== 'DRAFT') {
            return response.json(400, {
                message: 'A publication version that is not in DRAFT state cannot be updated.'
            });
        }

        if (event.body.content) {
            event.body.content = Helpers.getSafeHTML(event.body.content);
        }

        if (
            event.body.selfDeclaration !== undefined &&
            publicationVersion.publication.type !== 'PROTOCOL' &&
            publicationVersion.publication.type !== 'HYPOTHESIS'
        ) {
            return response.json(400, {
                message:
                    'You can not declare a self declaration for a publication that is not a protocol or hypothesis.'
            });
        }

        if (event.body.dataAccessStatement !== undefined && publicationVersion.publication.type !== 'DATA') {
            return response.json(400, {
                message: 'You can not supply a data access statement on a non data publication.'
            });
        }

        if (event.body.dataPermissionsStatement !== undefined && publicationVersion.publication.type !== 'DATA') {
            return response.json(400, {
                message: 'You can not supply a data permissions statement on a non data publication.'
            });
        }

        const { topics: topicIds } = event.body;
        let inheritedTopicIds: string[] = [];

        if (topicIds && publicationVersion.publication.type !== 'PROBLEM') {
            return response.json(400, {
                message: 'You can not supply topics for a publication that is not a problem.'
            });
        }

        // prevent user from deleting inherited topics
        if (topicIds && publicationVersion.versionNumber > 1) {
            const latestPublishedVersion = await publicationVersionService.get(
                publicationVersion.versionOf,
                'latestLive'
            );

            if (latestPublishedVersion) {
                inheritedTopicIds = latestPublishedVersion.topics.map((topic) => topic.id);

                if (inheritedTopicIds.some((topicId) => !topicIds.includes(topicId))) {
                    return response.json(403, { message: 'You are not allowed to delete inherited topics.' });
                }
            }
        }

        await publicationVersionService.update(event.pathParameters.publicationVersionId, {
            ...event.body,
            topics: topicIds ? { set: topicIds.map((topicId) => ({ id: topicId })) } : undefined
        });

        const updatedPublicationVersion = await publicationVersionService.getById(
            event.pathParameters.publicationVersionId
        );

        if (updatedPublicationVersion) {
            updatedPublicationVersion.topics = updatedPublicationVersion.topics.map((topic) => ({
                ...topic,
                draft: !inheritedTopicIds.includes(topic.id)
            }));
        }

        return response.json(200, updatedPublicationVersion);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const updateStatus = async (
    event: I.AuthenticatedAPIRequest<undefined, I.UpdateStatusQueryParams, I.UpdateStatusPathParams>
): Promise<I.JSONResponse> => {
    try {
        const publicationVersion = await publicationVersionService.getById(event.pathParameters.publicationVersionId);

        if (!publicationVersion) {
            return response.json(404, {
                message: 'This publication version does not exist.'
            });
        }

        if (publicationVersion.createdBy !== event.user.id) {
            return response.json(403, {
                message: 'You do not have permission to modify the status of this publication.'
            });
        }

        const newStatus = event.pathParameters?.status;
        const currentStatus = publicationVersion.currentStatus;

        if (currentStatus === 'LIVE') {
            return response.json(400, {
                message: 'A status of a publication that is not in DRAFT or LOCKED cannot be changed.'
            });
        }

        if (currentStatus === newStatus) {
            return response.json(400, { message: `Publication status is already ${newStatus}.` });
        }

        if (event.queryStringParameters.ariContactConsent) {
            if (newStatus !== 'LIVE') {
                return response.json(400, {
                    message: 'ARI contact consent is only applicable when changing status to LIVE.'
                });
            }

            const links = await publicationService.getDirectLinksForPublication(
                publicationVersion.versionOf,
                null,
                true
            );

            if (!links.linkedTo.some((link) => link.draft && link.externalSource === 'ARI')) {
                return response.json(400, {
                    message:
                        'A draft link to an ARI publication must exist from this publication if you provide the ariContactConsent parameter.'
                });
            }
        }

        if (currentStatus === 'DRAFT') {
            if (newStatus === 'LOCKED') {
                // check if publication version actually has co-authors
                if (publicationVersion.coAuthors.length === 1) {
                    return response.json(403, { message: 'Publication cannot be LOCKED without co-authors.' });
                }

                // check if publication version is ready to be LOCKED
                const isReadyToLock = await publicationVersionService.checkIsReadyToLock(publicationVersion);

                if (!isReadyToLock.ready) {
                    return response.json(400, {
                        message: isReadyToLock.message
                    });
                }

                // Lock publication from editing
                await publicationVersionService.updateStatus(publicationVersion.id, 'LOCKED');

                return response.json(200, { message: 'Publication status updated to LOCKED.' });
            }

            if (newStatus === 'LIVE') {
                const isReadyToPublish = await publicationVersionService.checkIsReadyToPublish(publicationVersion);

                if (!isReadyToPublish.ready) {
                    return response.json(400, {
                        message: isReadyToPublish.message
                    });
                }
            }
        }

        if (currentStatus === 'LOCKED') {
            if (newStatus === 'DRAFT') {
                // Update status to 'DRAFT'
                await publicationVersionService.updateStatus(publicationVersion.id, newStatus);

                // Cancel co author approvals
                await coAuthorService.resetCoAuthors(publicationVersion.id);

                return response.json(200, {
                    message: 'Publication unlocked for editing'
                });
            }

            if (newStatus === 'LIVE') {
                const isReadyToPublish = await publicationVersionService.checkIsReadyToPublish(publicationVersion);

                if (!isReadyToPublish.ready) {
                    return response.json(400, {
                        message: isReadyToPublish.message
                    });
                }
            }
        }

        // Publication version is being made LIVE and is valid.
        // Publish version.
        await publicationVersionService.updateStatus(
            publicationVersion.id,
            'LIVE',
            event.queryStringParameters.ariContactConsent
        );

        return response.json(200, { message: 'Publication is now LIVE.' });
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const deleteVersion = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.DeletePublicationVersionPathParams>
): Promise<I.JSONResponse> => {
    try {
        const publicationVersion = await publicationVersionService.getById(event.pathParameters.publicationVersionId);

        if (!publicationVersion) {
            return response.json(403, {
                message: 'This publication version does not exist.'
            });
        }

        if (publicationVersion.user.id !== event.user.id) {
            return response.json(403, {
                message: 'You do not have permission to delete this publication.'
            });
        }

        // The logic here is a bit odd, but the currentStatus and publicationStatus array are not intrinsically linked
        // so to be safe, we are checking that the current status is DRAFT and that the entire history of the publication
        // has only ever been draft.
        if (
            publicationVersion.currentStatus !== 'DRAFT' ||
            (publicationVersion.publicationStatus &&
                !publicationVersion.publicationStatus.every((status) => status.status !== 'LIVE'))
        ) {
            return response.json(400, {
                message: 'A publication can only be deleted if it is currently a draft and has never been LIVE.'
            });
        }

        // delete publication version
        await publicationVersionService.deleteVersion(publicationVersion);

        // delete all pending request control events for this publication version
        await eventService.deleteMany({
            type: 'REQUEST_CONTROL',
            data: {
                path: ['publicationVersion', 'id'],
                equals: publicationVersion.id
            }
        });

        return response.json(200, {
            message: `Publication version ${event.pathParameters.publicationVersionId} has been deleted`
        });
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const create = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.CreatePublicationVersionPathParams>
): Promise<I.JSONResponse> => {
    const publicationId = event.pathParameters.publicationId;

    try {
        // take the latest publication version
        const latestPublicationVersion = await publicationVersionService.privateGet(publicationId, 'latest');

        if (!latestPublicationVersion) {
            return response.json(404, {
                message: 'Publication not found.'
            });
        }

        if (latestPublicationVersion.publication.type === 'PEER_REVIEW') {
            return response.json(400, {
                message: 'Peer reviews cannot be reversioned.'
            });
        }

        if (latestPublicationVersion.publication.externalSource === 'ARI') {
            return response.json(400, {
                message: 'ARI publications cannot be reversioned.'
            });
        }

        // check if latest version is published
        if (latestPublicationVersion.currentStatus !== 'LIVE') {
            return response.json(400, {
                message:
                    'You cannot create a new version while the latest version of this publication has not been published yet.'
            });
        }

        // check if user is a co-author or the creator of the latest version
        if (
            !(
                latestPublicationVersion.user.id === event.user.id ||
                latestPublicationVersion.coAuthors.some((author) => author.linkedUser === event.user.id)
            )
        ) {
            return response.json(403, {
                message: 'You do not have permission to create a new version for this publication.'
            });
        }

        // create new version importing data from the latest one
        const newPublicationVersion = await publicationVersionService.create(latestPublicationVersion, event.user);

        return response.json(201, newPublicationVersion);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const requestControl = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.RequestControlPathParams>
): Promise<I.JSONResponse> => {
    const { publicationId, version } = event.pathParameters;

    try {
        // get publication version
        const publicationVersion = await publicationVersionService.privateGet(publicationId, version);

        if (!publicationVersion) {
            return response.json(404, {
                message: 'Publication version not found.'
            });
        }

        // check that versionNumber is at least 2
        if (publicationVersion.versionNumber < 2) {
            return response.json(403, {
                message: 'You are not allowed to request control over this publication version.'
            });
        }

        // check version status
        if (publicationVersion.currentStatus === 'LIVE') {
            return response.json(400, {
                message: 'You cannot request control over a published version.'
            });
        }

        // check that requester is not the corresponding author on this version
        if (event.user.id === publicationVersion.createdBy) {
            return response.json(403, {
                message: 'You cannot request control over your own publication version.'
            });
        }

        const previousPublicationVersion = await publicationVersionService.get(
            publicationVersion.versionOf,
            (publicationVersion.versionNumber - 1).toString()
        );

        if (!previousPublicationVersion) {
            return response.json(403, {
                message: 'Your authorship on the previous version cannot be verified.'
            });
        }

        // check if user is a co-author on the previous version
        if (
            !(
                previousPublicationVersion.user.id === event.user.id ||
                previousPublicationVersion.coAuthors.some((author) => author.linkedUser === event.user.id)
            )
        ) {
            return response.json(403, {
                message: 'You do not have permission to request control over this publication version.'
            });
        }

        // check if this user already requested control over this version
        const requestControlEvents = await eventService.getMany({
            type: 'REQUEST_CONTROL',
            data: {
                equals: {
                    requesterId: event.user.id,
                    publicationVersion: { id: publicationVersion.id, versionOf: publicationVersion.versionOf }
                }
            }
        });

        if (requestControlEvents.length) {
            return response.json(403, { message: 'You have already requested control over this publication version.' });
        }

        // create new 'REQUEST_CONTROL' event
        const requestControlEvent = await eventService.create('REQUEST_CONTROL', {
            requesterId: event.user.id,
            publicationVersion: { id: publicationVersion.id, versionOf: publicationVersion.versionOf }
        });

        // notify current corresponding author about the request
        await email.requestControl({
            eventId: requestControlEvent.id,
            publicationVersion: {
                id: publicationVersion.id,
                versionOf: publicationVersion.versionOf,
                title: publicationVersion.title || '',
                authorEmail: publicationVersion.user.email || ''
            },
            requesterName: Helpers.getUserFullName(event.user)
        });

        return response.json(200, { message: 'Successfully requested control over this publication version.' });
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const approveControlRequest = async (
    event: I.AuthenticatedAPIRequest<I.ApproveControlRequestBody, undefined, I.ApproveControlRequestPathParams>
): Promise<I.JSONResponse> => {
    const { publicationId, version } = event.pathParameters;
    const { approve, eventId } = event.body;
    const isApproved = approve === 'true';

    try {
        // get publication version
        const publicationVersion = await publicationVersionService.get(publicationId, version);

        if (!publicationVersion) {
            return response.json(404, {
                message: 'Publication version not found.'
            });
        }

        // check that user is the current corresponding author
        if (event.user.id !== publicationVersion.createdBy) {
            return response.json(403, { message: 'You are not allowed to approve this control request.' });
        }

        // check if there's a request control event for the given 'eventId'
        const requestControlEvent = await eventService.get(eventId);

        if (!requestControlEvent) {
            return response.json(404, { message: 'Control request not found.' });
        }

        const requestControlEventData = requestControlEvent.data as I.RequestControlData;
        const {
            requesterId,
            publicationVersion: { id: eventVersionId }
        } = requestControlEventData;

        // check that version id from the event matches the current version id
        if (eventVersionId !== publicationVersion.id) {
            return response.json(403, {
                message: "There's no control request for this publication version with the provided 'eventId'"
            });
        }

        const requester = await userService.get(requesterId, true);

        if (!requester) {
            return response.json(404, { message: 'Requester not found.' });
        }

        if (!isApproved) {
            // delete request control event
            await eventService.deleteEvent(requestControlEvent.id);

            // notify requester that they've been rejected
            await email.rejectControlRequest({
                requesterEmail: requester.email || '',
                publicationVersion: {
                    authorFullName: Helpers.getUserFullName(publicationVersion.user),
                    title: publicationVersion.title || ''
                }
            });

            return response.json(200, { message: 'This control request has been rejected.' });
        }

        // transfer ownership
        await publicationVersionService.transferOwnership(publicationVersion.id, requester.id, requester.email || '');

        // reset co-authors in order to enforce adding affiliations and confirm their involvement
        await coAuthorService.resetCoAuthors(publicationVersion.id);

        // notify requester that they've been approved to take control over this version
        await email.approveControlRequest({
            requesterEmail: requester.email || '',
            publicationVersion: {
                authorFullName: Helpers.getUserFullName(publicationVersion.user),
                title: publicationVersion.title || '',
                url: Helpers.getPublicationUrl(publicationVersion.versionOf)
            }
        });

        // notify the rest of requesters that their control request has been dismissed
        const otherRequests = (await eventService.getMany({
            type: 'REQUEST_CONTROL',
            id: {
                not: requestControlEvent.id
            },
            data: {
                path: ['publicationVersion', 'id'],
                equals: publicationVersion.id
            }
        })) as I.RequestControlEvent[];

        if (otherRequests.length) {
            for (const request of otherRequests) {
                const supersededRequester = await userService.get(request.data.requesterId, true);

                if (supersededRequester) {
                    // send email to the superseded requester
                    await email.controlRequestSuperseded({
                        newCorrespondingAuthorFullName: Helpers.getUserFullName(requester),
                        publicationVersionTitle: publicationVersion.title || '',
                        requesterEmail: supersededRequester.email || ''
                    });
                }
            }
        }

        // delete all pending request control events for this publication version
        await eventService.deleteMany({
            type: 'REQUEST_CONTROL',
            data: {
                path: ['publicationVersion', 'id'],
                equals: publicationVersion.id
            }
        });

        return response.json(200, { message: 'Successfully transferred control over this publication version.' });
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};
