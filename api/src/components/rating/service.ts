import * as client from 'lib/client';
import * as Helpers from 'lib/helpers';
import * as I from 'interface';

export const isValid = (pubType: string, ratingType: string) =>
    Boolean(Helpers.PublicationInformation[pubType].ratingCategories.includes(ratingType));

export const upsert = async (publication: string, user: string, category: I.Ratings, rating: number) => {
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
};

export const getAggregate = async (id: string | Array<string>) => {
    const publicationRatings = await client.prisma.publicationRatings.groupBy({
        where: {
            publicationId: {
                in: Array.isArray(id) ? id : [id]
            }
        },
        by: ['category', 'id'],
        _count: {
            id: true
        },
        _avg: {
            rating: true
        }
    });

    return publicationRatings;
};

export const getOverall = async (id: string) => {
    const overallRatings = await client.prisma.publicationRatings.aggregate({
        _avg: {
            rating: true
        },
        where: {
            publicationId: id
        },
        _count: {
            rating: true
        }
    });

    return overallRatings;
};
