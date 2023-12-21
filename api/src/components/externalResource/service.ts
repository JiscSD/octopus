import * as client from 'lib/client';
import * as I from 'interface';
import * as publicationVersionService from 'publicationVersion/service';

export const create = async (publicationVersionId: string, data: I.CreateExternalResourceBody) => {
    const externalResource = await client.prisma.externalResource.create({
        data: {
            publicationVersionId,
            ...data
        }
    });
    await publicationVersionService.update(publicationVersionId, { updatedAt: new Date().toISOString() });

    return externalResource;
};
