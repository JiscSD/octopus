import * as response from 'lib/response';
import * as publicationBookmarkService from 'publicationBookmark/service';
import * as publicationService from 'publication/service';
import * as I from 'interface';

export const create = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.CreatePublicationBookmarkPathParams>
): Promise<I.JSONResponse> => {
    try {
        const publication = await publicationService.get(event.pathParameters.id);

        //check that the publication exists
        if (!publication) {
            return response.json(404, {
                message: 'This publication does not exist.'
            });
        }

        //check that the publication is live
        if (publication.currentStatus === 'DRAFT') {
            return response.json(403, {
                message: 'You cannot bookmark a draft publication.'
            });
        }

        // check to see if the user is the author or co author. if so throw an error
        const isUserCoAuthor = publication.coAuthors.some((user) => user.id == event.user.id);

        if (isUserCoAuthor || event.user.id === publication.user.id) {
            return response.json(401, {
                message: 'You cannot bookmark a publication you have authored or co-authored.'
            });
        }

        const bookmark = await publicationBookmarkService.get(event.pathParameters.id, event.user.id);

        // check that the user hasn't already bookmarked this publication
        if (bookmark) {
            return response.json(404, {
                message: 'You have already bookmarked this publication.'
            });
        }

        await publicationBookmarkService.create(event.pathParameters.id, event.user.id);

        return response.json(200, { message: 'You have bookmarked this publication.' });
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const remove = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.RemovePublicationBookmarkPathParams>
): Promise<I.JSONResponse> => {
    try {
        const publication = await publicationService.get(event.pathParameters.id);

        //check that the publication exists
        if (!publication) {
            return response.json(404, {
                message: 'This publication does not exist.'
            });
        }

        //check that the publication is live
        if (publication.currentStatus === 'DRAFT') {
            return response.json(404, {
                message: 'You cannot bookmark a draft publication.'
            });
        }

        const bookmark = await publicationBookmarkService.get(event.pathParameters.id, event.user.id);

        // check that the user has created the bookmark/ hasn't already deleted it
        if (!bookmark) {
            return response.json(404, {
                message: 'You do not have a bookmark to remove for this publication.'
            });
        }

        await publicationBookmarkService.remove(bookmark.id);

        return response.json(200, { message: 'Bookmark deleted from this publication.' });
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const get = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.GetPublicationBookmarkPathParams>
): Promise<I.JSONResponse> => {
    try {
        const publication = await publicationService.get(event.pathParameters.id);

        //check that the publication exists
        if (!publication) {
            return response.json(404, {
                message: 'This publication does not exist.'
            });
        }

        //check that the publication is live
        if (publication.currentStatus === 'DRAFT') {
            return response.json(404, {
                message: 'This publication is in a draft state, so no bookmark exists.'
            });
        }

        const bookmark = await publicationBookmarkService.get(event.pathParameters.id, event.user.id);

        if (!bookmark) {
            return response.json(200, false);
        }

        return response.json(200, bookmark);
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const getAll = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.GetAllPublicationBookmarkPathParams>
): Promise<I.JSONResponse> => {
    try {
        const bookmarks = await publicationBookmarkService.getAll(event.user.id);

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
