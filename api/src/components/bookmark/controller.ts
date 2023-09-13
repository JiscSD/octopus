import * as response from 'lib/response';
import * as bookmarkService from 'bookmark/service';
import * as publicationService from 'publication/service';
import * as topicService from 'topic/service';
import * as I from 'interface';

export const create = async (
    event: I.AuthenticatedAPIRequest<I.CreateBookmarkRequestBody>
): Promise<I.JSONResponse> => {
    const { type, entityId } = event.body;

    try {
        // Checks depending on bookmark type
        switch (type) {
            case 'PUBLICATION': {
                const publication = await publicationService.get(entityId);

                // Check that the publication exists
                if (!publication) {
                    return response.json(404, {
                        message: 'This publication does not exist.'
                    });
                }

                // Check that the publication has a live version
                if (!publication.versions.some((version) => version.currentStatus === 'LIVE')) {
                    return response.json(403, {
                        message: 'You cannot bookmark a publication which has not gone live.'
                    });
                }

                const latestPublishedVersion =
                    publication.versions.find((version) => version.isCurrent && version.currentStatus === 'LIVE') ||
                    publication.versions.find((version) => version.versionNumber === publication.versions.length - 1);

                if (!latestPublishedVersion) {
                    throw Error('Could not get latest published version of publication');
                }

                // Check to see if the user is the author or a co author of the latest published version
                // of the publication. If so throw an error
                const isUserAuthor =
                    latestPublishedVersion.coAuthors.some((coAuthor) => coAuthor.linkedUser == event.user.id) ||
                    latestPublishedVersion.user.id === event.user.id;

                if (isUserAuthor) {
                    return response.json(401, {
                        message: 'You cannot bookmark a publication you have authored or co-authored.'
                    });
                }

                break;
            }

            case 'TOPIC': {
                // Check that the topic exists
                const topic = await topicService.get(entityId);

                if (!topic) {
                    return response.json(404, {
                        message: 'This topic does not exist.'
                    });
                }

                break;
            }

            default:
                // Invalid bookmark type supplied
                return response.json(400, {
                    message: 'Invalid bookmark type.'
                });
        }

        // Generic checks

        // Check that the user hasn't already bookmarked this entity
        const existingBookmark = await bookmarkService.getByFields(type, entityId, event.user.id);

        if (existingBookmark) {
            return response.json(400, {
                message: 'You have already bookmarked this entity.'
            });
        }

        // Create bookmark
        const bookmark = await bookmarkService.create(type, entityId, event.user.id);

        return response.json(201, bookmark);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const deleteBookmark = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.DeleteBookmarkPathParams>
): Promise<I.JSONResponse> => {
    try {
        // Generic checks

        // Check that the bookmark exists
        const bookmark = await bookmarkService.get(event.pathParameters.id);

        if (!bookmark) {
            return response.json(404, {
                message: 'This bookmark does not exist.'
            });
        }

        // Check that the user owns the bookmark
        if (bookmark.userId !== event.user.id) {
            return response.json(403, {
                message: 'You do not own this bookmark.'
            });
        }

        // Delete bookmark
        await bookmarkService.deleteBookmark(bookmark.id);

        return response.json(200, { message: 'Bookmark deleted successfully.' });
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const getAll = async (
    event: I.AuthenticatedAPIRequest<undefined, I.GetAllBookmarksQueryStringParameters>
): Promise<I.JSONResponse> => {
    try {
        const typeFilter: I.BookmarkType = event.queryStringParameters.type;
        const entityFilter = event.queryStringParameters.entityId || undefined;
        const bookmarks = await bookmarkService.getMany(event.user.id, typeFilter, entityFilter);

        return response.json(200, bookmarks);
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};
