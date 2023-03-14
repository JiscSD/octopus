import * as client from 'lib/client';
import * as I from 'interface';

export const create = async (publicationId: string, data: I.CreateAffiliationRequestBody) => {
    const affiliation = await client.prisma.affiliations.create({
        data: {
            city: data.city,
            country: data.country,
            ror: data.ror,
            publicationId,
            name: data.name,
            link: data.link
        }
    });

    return affiliation;
};

export const destroy = async (publicationId: string, affiliationId: string) => {
    const affiliation = await client.prisma.affiliations.deleteMany({
        where: {
            publicationId,
            id: affiliationId
        }
    });

    return affiliation;
};

export const destroyAll = async (publicationId: string) => {
    const affiliation = await client.prisma.affiliations.deleteMany({
        where: {
            publicationId
        }
    });

    return affiliation;
};
