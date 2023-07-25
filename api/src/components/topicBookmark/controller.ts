import * as response from 'lib/response';
import * as topicBookmarkService from 'topicBookmark/service';
import * as topicService from 'topic/service';
import * as I from 'interface';

export const create = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.CreateTopicBookmarkPathParams>
): Promise<I.JSONResponse> => {
    try {
        const topic = await topicService.get(event.pathParameters.id);

        // Check that the topic exists
        if (!topic) {
            return response.json(404, {
                message: 'This topic does not exist.'
            });
        }

        const bookmark = await topicBookmarkService.get(event.pathParameters.id, event.user.id);

        // check that the user hasn't already bookmarked this publication
        if (bookmark) {
            return response.json(404, {
                message: 'You have already bookmarked this topic.'
            });
        }

        await topicBookmarkService.create(event.pathParameters.id, event.user.id);

        return response.json(200, { message: 'You have bookmarked this topic.' });
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const remove = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.RemoveTopicBookmarkPathParams>
): Promise<I.JSONResponse> => {
    try {
        const topic = await topicService.get(event.pathParameters.id);

        // Check that the topic exists
        if (!topic) {
            return response.json(404, {
                message: 'This topic does not exist.'
            });
        }

        const bookmark = await topicBookmarkService.get(event.pathParameters.id, event.user.id);

        // Check that the user has created the bookmark / hasn't already deleted it
        if (!bookmark) {
            return response.json(404, {
                message: 'You do not have a bookmark to remove for this topic.'
            });
        }

        await topicBookmarkService.remove(bookmark.id);

        return response.json(200, { message: 'Bookmark deleted from this topic.' });
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const get = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.GetTopicBookmarkPathParams>
): Promise<I.JSONResponse> => {
    try {
        const topic = await topicService.get(event.pathParameters.id);

        // Check that the topic exists
        if (!topic) {
            return response.json(404, {
                message: 'This topic does not exist.'
            });
        }

        const bookmark = await topicBookmarkService.get(event.pathParameters.id, event.user.id);

        if (!bookmark) {
            return response.json(200, false);
        }

        return response.json(200, bookmark);
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const getAll = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.GetAllTopicBookmarkPathParams>
): Promise<I.JSONResponse> => {
    try {
        const bookmarks = await topicBookmarkService.getAll(event.user.id);

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