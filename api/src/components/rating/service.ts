import * as client from 'lib/client';
import * as Helpers from 'lib/helpers'
import * as I from 'interface';

export const isValid = (pubType: string, ratingType: string) => Boolean(
    Helpers.PublicationInformation[pubType].ratingCategories.includes(ratingType)
);

export const upsert = async (
    publication: string, 
    user: string, 
    category: I.Ratings, 
    rating: number
) => {
    const id = `${publication}-${user}-${category}`;

    const ratingRow = await client.prisma.publicationRatings.upsert({
        where: {
            id
        },
        update: {
            rating
        },
        create: {
            id,
            userId: user,
            publicationId: publication,
            category,
            rating
        }
    });
    return ratingRow;
}