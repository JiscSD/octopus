import * as response from 'lib/response';
import * as publicationService from 'publication/service';
import * as ratingService from 'rating/service';
import * as I from 'interface';

export const upsert = async (
    event: I.AuthenticatedAPIRequest<I.CreateRatingRequestBody, undefined, I.GetPublicationPathParams>
) => {
    try {
        const publication = await publicationService.get(event.pathParameters.id);

        // Checking to make sure the publication isn't live
        if (publication?.currentStatus !== 'LIVE') {
            return response.json(404, {
                message: 'You cant rate a non live publication'
            });
        }

        // Ensure the request is trying to create a rating on a real publication
        if (!publication) {
            return response.json(404, {
                message: 'No publication by the provided ID'
            });
        }

        // Ensure the user isn't rating their own publication
        if (publication.user.id === event?.user.id) {
            return response.json(403, {
                message: 'Cannot rate your own publication'
            });
        }

        // Helper method to check if the publication type & rating category submitted is ok
        const isRatingCategoryValid = ratingService.isValid(publication.type, event.body.type);

        if (!isRatingCategoryValid) {
            return response.json(403, {
                message: 'Invalid rating category for publication type'
            });
        }

        const rating = await ratingService.upsert(
            event.pathParameters.id,
            event.user.id,
            event.body.type,
            event.body.value
        );

        // passed all of the if else statements, create a rating
        return response.json(200, rating);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};
