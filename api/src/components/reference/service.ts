import * as I from 'interface';
import * as client from 'lib/client';

export const getAllByPublication = async (publicationId: string) => {
    const references = await client.prisma.references.findMany({
        where: {
            publicationId
        }
    });
    return references;
};

export const create = async (data) => {
    const created = await client.prisma.references.create({ data });
    return created;
};

export const update = async (id: string, data: I.Reference) => {
    const updated = await client.prisma.references.update({
        data,
        where: {
            id
        }
    });
    return updated;
};

export const remove = async (id: string) => {
    const deleted = await client.prisma.references.delete({
        where: {
            id
        }
    });
    return deleted;
};

export const removeAll = async (publicationId: string) => {
    const deleted = await client.prisma.references.deleteMany({
        where: {
            publicationId
        }
    });
    return deleted;
};

export const updateAll = async (publicationId, data) => {
    await client.prisma.references.deleteMany({
        where: {
            publicationId
        }
    });

    const created = await client.prisma.references.createMany({ data });
    return created;
};
