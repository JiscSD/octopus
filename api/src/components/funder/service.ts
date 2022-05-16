import * as client from 'lib/client';
import * as I from 'interface';

export const create = async (publicationId: string, data: I.CreateFunderRequestBody) => {
    const funder = await client.prisma.funders.create({
        data: {
            city: data.city,
            country: data.country,
            ror: data.ror,
            publicationId,
            name: data.name,
            link: data.link
        }
    });

    return funder;
};

export const destroy = async (publicationId: string, funderId: string) => {
    const funder = await client.prisma.funders.deleteMany({
        where: {
            publicationId,
            id: funderId
        }
    });

    return funder;
};
