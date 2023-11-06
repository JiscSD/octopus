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

        // only the owner or co-authors can view publications
        if (
            event.user?.id === publicationVersion.user.id ||
            publicationVersion.coAuthors.some((coAuthor) => coAuthor.linkedUser === event.user?.id)
        ) {
            return response.json(200, publicationVersion);
        }

        return response.json(403, {
            message: 'You do not have permission to view this publication version.'
        });
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
            return response.json(403, {
                message: 'This publication version does not exist.'
            });
        }

        if (publicationVersion.user.id !== event.user.id) {
            return response.json(403, {
                message: 'You do not have permission to modify this publication version.'
            });
        }

        if (publicationVersion.currentStatus !== 'DRAFT') {
            return response.json(404, {
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

        await publicationVersionService.update(event.pathParameters.id, event.body);

        const updatedPublicationVersion = await publicationVersionService.getById(event.pathParameters.id);

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

        // create version DOI
        const publicationVersionDOI = await helpers.createPublicationVersionDOI(publicationVersion);

        // update version status first so that published date is available for Open Search
        await publicationVersionService.updateStatus(publicationVersion.id, 'LIVE');

        // update version DOI into DB
        const updatedVersion = await publicationVersionService.update(publicationVersion.id, {
            doi: publicationVersionDOI.data.attributes.doi
        });

        // now that the publication version is LIVE, add/update the opensearch record
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

        // Publication version is live, so update the canonical DOI with this version info
        await helpers.updatePublicationDOI(publicationVersion.publication.doi, updatedVersion);

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
