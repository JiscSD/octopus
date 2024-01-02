import * as client from 'lib/client';
import * as I from 'interface';
import * as publicationVersionService from 'publicationVersion/service';

export const create = async (publicationVersionId: string, data: I.CreateFunderRequestBody) => {
    const funder = await client.prisma.funders.create({
        data: {
            city: data.city,
            country: data.country,
            ror: data.ror,
            publicationVersionId,
            name: data.name,
            link: data.link
        }
    });
    await publicationVersionService.update(publicationVersionId, {
        updatedAt: new Date().toISOString()
    });

    return funder;
};

export const destroy = async (publicationVersionId: string, funderId: string) => {
    const funder = await client.prisma.funders.deleteMany({
        where: {
            publicationVersionId,
            id: funderId
        }
    });
    await publicationVersionService.update(publicationVersionId, {
        updatedAt: new Date().toISOString()
    });

    return funder;
};
