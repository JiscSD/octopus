import * as client from 'lib/client';

export const getAllByPublication = async (publicationId: string) => {
    // References are attached to the version. By default, get the current version's references.
    const latestVersion = await client.prisma.publicationVersion.findFirst({
        where: {
            versionOf: publicationId,
            isCurrent: true
        },
        select: {
            id: true
        }
    });
    const references = await client.prisma.references.findMany({
        where: {
            publicationVersionId: latestVersion?.id
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
