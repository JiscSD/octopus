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
                if (!publication.versions.some((version) => version.isLatestLiveVersion)) {
                    return response.json(400, {
                        message: 'You cannot bookmark a publication which has not gone live.'
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

                // check if it's god topic
                if (!topic.parents.length) {
                    return response.json(403, { message: 'Bookmarking against high level topics is not allowed.' });
                }

                // check if the parent of this topic is the god topic
                if (topic.parents.length === 1) {
                    const parentTopic = await topicService.get(topic.parents[0].id);

                    if (!parentTopic?.parents.length) {
                        return response.json(403, {
                            message: 'Bookmarking against high level topics is not allowed.'
                        });
                    }
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
