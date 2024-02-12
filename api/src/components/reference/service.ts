import * as client from 'lib/client';
import * as I from 'interface';
import * as publicationVersionService from 'publicationVersion/service';

export const getAllByPublicationVersion = (publicationVersionId: string) =>
    client.prisma.references.findMany({
        where: {
            publicationVersionId
        }
    });

export const updateAll = async (publicationVersionId: string, data: I.UpdateReferencesBody) => {
    await client.prisma.references.deleteMany({
        where: {
            publicationVersionId
        }
    });

    const create = await client.prisma.references.createMany({
        data
    });

    await publicationVersionService.update(publicationVersionId, { updatedAt: new Date().toISOString() });

    return create;
};
