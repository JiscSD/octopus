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
                // Check that the publication exists
                const publication = await publicationService.get(entityId);

                if (!publication) {
                    return response.json(404, {
                        message: 'This publication does not exist.'
                    });
                }

                // Check that the publication is live
                if (publication.currentStatus === 'DRAFT') {
                    return response.json(403, {
                        message: 'You cannot bookmark a draft publication.'
                    });
                }

                // Check to see if the user is the author or co author. If so throw an error
                const isUserCoAuthor = publication.coAuthors.some((coAuthor) => coAuthor.linkedUser == event.user.id);

                if (isUserCoAuthor || event.user.id === publication.user.id) {
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
        const bookmark = await bookmarkService.getByFields(type, entityId, event.user.id);

        if (bookmark) {
            return response.json(400, {
                message: 'You have already bookmarked this entity.'
            });
        }

        // Create bookmark
        await bookmarkService.create(type, entityId, event.user.id);

        return response.json(200, { message: 'Bookmark created successfully.' });
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

        const { id, type, entityId } = bookmark;

        // Check that the user owns the bookmark
        if (bookmark.userId !== event.user.id) {
            return response.json(403, {
                message: 'You do not own this bookmark.'
            });
        }

        // Checks depending on bookmark type
        switch (type) {
            case 'PUBLICATION': {
                // Check that the publication exists
                const publication = await publicationService.get(entityId);

                if (!publication) {
                    return response.json(404, {
                        message: 'This publication does not exist.'
                    });
                }

                // Check that the publication is live
                if (publication.currentStatus === 'DRAFT') {
                    return response.json(404, {
                        message: 'You cannot bookmark a draft publication.'
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

        // Delete bookmark
        await bookmarkService.deleteBookmark(id);

        return response.json(200, { message: 'Bookmark deleted successfully.' });
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

// For checking whether an entity is bookmarked.
export const get = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.GetBookmarkPathParams>
): Promise<I.JSONResponse> => {
    const type = event.pathParameters.type.toUpperCase();

    try {
        // Checks depending on bookmark type
        switch (type) {
            case 'PUBLICATION': {
                // Check that the publication exists
                const publication = await publicationService.get(event.pathParameters.entityId);

                if (!publication) {
                    return response.json(404, {
                        message: 'This publication does not exist.'
                    });
                }

                // Check that the publication is live
                if (publication.currentStatus === 'DRAFT') {
                    return response.json(404, {
                        message: 'This publication is in a draft state, so no bookmark exists.'
                    });
                }

                break;
            }

            case 'TOPIC': {
                // Check that the topic exists
                const topic = await topicService.get(event.pathParameters.entityId);

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

        // Get bookmark
        const bookmark = await bookmarkService.getByFields(type, event.pathParameters.entityId, event.user.id);

        if (!bookmark) {
            return response.json(200, false);
        }

        return response.json(200, bookmark);
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const getAll = async (event: I.AuthenticatedAPIRequest): Promise<I.JSONResponse> => {
    try {
        const typeFilter: I.BookmarkType | undefined = event.queryStringParameters?.type as I.BookmarkType;
        const bookmarks = await bookmarkService.getAll(event.user.id, typeFilter);

        if (!bookmarks) {
            return response.json(404, {
                message: 'No bookmarks found for this user.'
            });
        }

        return response.json(200, bookmarks);
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};
