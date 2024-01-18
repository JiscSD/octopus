import * as client from 'lib/client';

export const create = async (publications: [string, string], userId: string) => {
    return await client.prisma.crosslink.create({
        data: {
            publicationFromId: publications[0],
            publicationToId: publications[1],
            createdBy: userId
        }
    });
};

export const getByPublicationPair = async (publications: [string, string]) => {
    return await client.prisma.crosslink.findFirst({
        where: {
            OR: [
                {
                    publicationFromId: publications[0],
                    publicationToId: publications[1]
                },
                {
                    publicationFromId: publications[1],
                    publicationToId: publications[0]
                }
            ]
        }
    });
};
