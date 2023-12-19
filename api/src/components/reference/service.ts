import * as client from 'lib/client';
import * as I from 'interface';

export const getAllByPublicationVersion = async (publicationVersionId: string) => {
    return await client.prisma.references.findMany({
        where: {
            publicationVersionId
        }
    });
};

export const updateAll = async (publicationVersionId: string, data: I.UpdateReferencesBody) => {
    await client.prisma.references.deleteMany({
        where: {
            publicationVersionId
        }
    });

    const create = await client.prisma.references.createMany({
        data
    });

    await client.prisma.publicationVersion.update({
        where: {
            id: publicationVersionId
        },
        data: {
            updatedAt: new Date().toISOString()
        }
    });

    return create;
};
