import * as I from 'interface';
import * as client from 'lib/client';

export const getAllByPublication = async (publicationId: string): Promise<Array<I.Reference>> => {
    const references = await client.prisma.references.findMany({
        where: {
            publicationId
        }
    });
    return references;
};

export const create = async (publicationId: string, type: I.ReferenceType, text: string): Promise<I.Reference> => {
    const created = await client.prisma.references.create({
        data: {
            publicationId,
            type,
            text
        }
    });
    return created;
};

export const update = async (id: string, type: I.ReferenceType, text: string): Promise<I.Reference> => {
    const updated = await client.prisma.references.update({
        data: {
            type,
            text
        },
        where: {
            id
        }
    });
    return updated;
};

export const remove = async (id: string): Promise<I.Reference> => {
    const deleted = await client.prisma.references.delete({
        where: {
            id
        }
    });
    return deleted;
};
