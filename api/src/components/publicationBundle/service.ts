import * as client from 'lib/client';
import * as I from 'interface';

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

export const edit = (id: string, data: I.EditPublicationBundleRequestBody) =>
    client.prisma.publicationBundle.update({
        where: { id },
        data: {
            name: data.name ?? undefined,
            publications: data.publicationIds
                ? {
                      set: data.publicationIds.map((id) => ({ id }))
                  }
                : undefined
        },
        include: {
            publications: true
        }
    });

export const get = (id: string) =>
    client.prisma.publicationBundle.findUnique({
        where: { id },
        include: {
            publications: true
        }
    });
