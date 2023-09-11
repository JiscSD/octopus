import * as client from 'lib/client';
import * as I from 'interface';

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

    // Return with publicationId.
    return references.map((reference) => {
        const { publicationVersionId, ...referenceRest } = reference;

        return { publicationId, ...referenceRest };
    });
};

export const updateAll = async (publicationId, data: I.UpdateReferencesBody) => {
    const latestVersion = await client.prisma.publicationVersion.findFirst({
        where: {
            versionOf: publicationId,
            isCurrent: true
        },
        select: {
            id: true
        }
    });

    if (!latestVersion) {
        throw Error('Publication does not have a latest version');
    }

    await client.prisma.references.deleteMany({
        where: {
            publicationVersionId: latestVersion?.id
        }
    });

    // Event body contains a publication ID. Replace this with the latest version's ID.
    const createManyInput = data.map((reference) => {
        const { publicationId, ...referenceRest } = reference;

        return { publicationVersionId: latestVersion.id, ...referenceRest };
    });
    const created = await client.prisma.references.createMany({
        data: createManyInput
    });

    return created;
};
