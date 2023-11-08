import htmlToText from 'html-to-text';
import * as I from 'interface';
import * as response from 'lib/response';
import * as publicationVersionService from 'publicationVersion/service';
import * as publicationService from 'publication/service';
import * as coAuthorService from 'coauthor/service';
import * as helpers from 'lib/helpers';
import * as sqs from 'lib/sqs';

export const get = async (
    event: I.APIRequest<undefined, undefined, I.GetPublicationVersionPathParams>
): Promise<I.JSONResponse> => {
    const { id, version } = event.pathParameters;

    try {
        const publicationVersion = await publicationVersionService.get(id, version);

        if (!publicationVersion) {
            return response.json(404, {
                message: 'Publication version not found.'
            });
        }

        // anyone can see a LIVE publication
        if (publicationVersion.currentStatus === 'LIVE') {
            return response.json(200, publicationVersion);
        }

        // only the owner or co-authors can view a DRAFT publication version
        if (
            !(
                event.user?.id === publicationVersion.user.id ||
                publicationVersion.coAuthors.some((coAuthor) => coAuthor.linkedUser === event.user?.id)
            )
        ) {
            // if client requested the "latest" version but user doesn't have permissions to see it
            // return the latest published version instead, if exists
            if (version === 'latest' && publicationVersion.versionNumber > 1) {
                const latestPublishedVersion = await publicationVersionService.get(id, 'latestLive');

                return response.json(200, latestPublishedVersion);
            }

            return response.json(403, {
                message: 'You do not have permission to view this publication version.'
            });
        }

        // map "draft" topics before sending the response to the client
        let inheritedTopicIds: string[] = [];

        if (publicationVersion.versionNumber > 1) {
            const latestPublishedVersion = await publicationVersionService.get(id, 'latestLive');

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
    event: I.AuthenticatedAPIRequest<undefined, I.OpenSearchPublicationFilters>
): Promise<I.JSONResponse> => {
    try {
        const openSearchPublications = await publicationService.getOpenSearchPublications(event.queryStringParameters);

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
        const publicationVersion = await publicationVersionService.getById(event.pathParameters.id);

        if (!publicationVersion) {
            return response.json(404, {
                message: 'This publication version does not exist.'
            });
        }

        if (publicationVersion.user.id !== event.user.id) {
            return response.json(403, {
                message: 'You do not have permission to update topics for this publication version.'
            });
        }

        if (publicationVersion.currentStatus !== 'DRAFT') {
            return response.json(403, {
                message: 'A publication version that is not in DRAFT state cannot be updated.'
            });
        }

        if (event.body.content) {
            event.body.content = helpers.getSafeHTML(event.body.content);
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

        await publicationVersionService.update(event.pathParameters.id, {
            ...event.body,
            topics: topicIds ? { set: topicIds.map((topicId) => ({ id: topicId })) } : undefined
        });

        const updatedPublicationVersion = await publicationVersionService.getById(event.pathParameters.id);

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
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.UpdateStatusPathParams>
): Promise<I.JSONResponse> => {
    try {
        const publicationVersion = await publicationVersionService.getById(event.pathParameters.id);

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
            return response.json(403, {
                message: 'A status of a publication that is not in DRAFT or LOCKED cannot be changed.'
            });
        }

        if (currentStatus === newStatus) {
            return response.json(403, { message: `Publication status is already ${newStatus}.` });
        }

        if (currentStatus === 'DRAFT') {
            if (newStatus === 'LOCKED') {
                // check if publication version actually has co-authors
                if (publicationVersion.coAuthors.length === 1) {
                    return response.json(403, { message: 'Publication cannot be LOCKED without co-authors.' });
                }

                // check if publication version is ready to be LOCKED
                if (!(await publicationVersionService.checkIsReadyToLock(publicationVersion))) {
                    return response.json(403, {
                        message: 'Publication is not ready to be LOCKED. Make sure all fields are filled in.'
                    });
                }

                // Lock publication from editing
                await publicationVersionService.updateStatus(publicationVersion.id, 'LOCKED');

                return response.json(200, { message: 'Publication status updated to LOCKED.' });
            }

            if (newStatus === 'LIVE') {
                const isReadyToPublish = await publicationVersionService.checkIsReadyToPublish(publicationVersion);

                if (!isReadyToPublish) {
                    return response.json(403, {
                        message: 'Publication is not ready to be made LIVE. Make sure all fields are filled in.'
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

                if (!isReadyToPublish) {
                    return response.json(403, {
                        message: 'Publication is not ready to be made LIVE. Make sure all fields are filled in.'
                    });
                }
            }
        }

        let previousPublicationVersion: I.PublicationVersion | null = null;

        if (publicationVersion.versionNumber > 1) {
            previousPublicationVersion = await publicationVersionService.get(
                publicationVersion.versionOf,
                publicationVersion.versionNumber - 1
            );
        }

        // create new version DOI
        const newPublicationVersionDOI = await helpers.createPublicationVersionDOI(
            publicationVersion,
            previousPublicationVersion?.doi as string
        );

        if (previousPublicationVersion && previousPublicationVersion.doi) {
            // update previous version DOI
            await helpers.updatePreviousPublicationVersionDOI(
                previousPublicationVersion,
                newPublicationVersionDOI.data.attributes.doi
            );
        }

        // update version status first so that published date is available for Open Search record
        await publicationVersionService.updateStatus(publicationVersion.id, 'LIVE');

        // update the new version DOI into DB
        const updatedVersion = await publicationVersionService.update(publicationVersion.id, {
            doi: newPublicationVersionDOI.data.attributes.doi
        });

        // update the canonical DOI with this new published version info
        await helpers.updatePublicationDOI(publicationVersion.publication.doi, updatedVersion);

        if (previousPublicationVersion) {
            // delete old OpenSearch record
            await publicationService.deleteOpenSearchRecord(updatedVersion.versionOf);
        }

        // create new record
        await publicationService.createOpenSearchRecord({
            id: updatedVersion.versionOf,
            type: updatedVersion.publication.type,
            title: updatedVersion.title,
            licence: updatedVersion.licence,
            description: updatedVersion.description,
            keywords: updatedVersion.keywords,
            content: updatedVersion.content,
            publishedDate: updatedVersion.publishedDate,
            cleanContent: htmlToText.convert(updatedVersion.content)
        });

        // send message to the pdf generation queue
        // currently only on deployed instances while a local solution is developed
        if (process.env.STAGE !== 'local') await sqs.sendMessage(publicationVersion.versionOf);

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
        const publicationVersion = await publicationVersionService.getById(event.pathParameters.id);

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
            return response.json(403, {
                message: 'A publication can only be deleted if it is currently a draft and has never been LIVE.'
            });
        }

        await publicationVersionService.deleteVersion(publicationVersion);

        return response.json(200, { message: `Publication version ${event.pathParameters.id} has been deleted` });
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const create = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.CreatePublicationVersionPathParams>
): Promise<I.JSONResponse> => {
    /**
     * @TODO - remove stage check when ready to go in production
     */
    if (!['local', 'int'].includes(process.env.STAGE!)) {
        return response.json(403, 'This feature is not available yet in the current environment.');
    }

    const publicationId = event.pathParameters.id;

    try {
        // take the latest publication version
        const latestPublicationVersion = await publicationVersionService.get(publicationId, 'latest');

        if (!latestPublicationVersion) {
            return response.json(404, {
                message: 'Publication not found.'
            });
        }

        // check if latest version is published
        if (latestPublicationVersion.currentStatus !== 'LIVE') {
            return response.json(403, {
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
