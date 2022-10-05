import * as client from 'lib/client';

export const getAllByPublication = async (publicationId: string) => {
    const references = await client.prisma.references.findMany({
        where: {
            publicationId
        }
    });
    return references;
};

export const updateAll = async (publicationId, data) => {
    await client.prisma.references.deleteMany({
        where: {
            publicationId
        }
    });

    const created = await client.prisma.references.createMany({
        data
    });
    return created;
};
