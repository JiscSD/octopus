import * as client from 'lib/client';

export const create = (data: { name: string; publicationIds: string[]; userId: string }) =>
    client.prisma.publicationBundle.create({
        data: {
            name: data.name,
            createdBy: data.userId,
            publications: {
                connect: data.publicationIds.map((id) => ({ id }))
            }
        },
        include: {
            publications: true
        }
    });
