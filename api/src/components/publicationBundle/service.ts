import * as client from 'lib/client';
import * as I from 'interface';
import { Prisma } from '@prisma/client';

export const create = (data: { name: string; publicationIds: string[]; userId: string }) =>
    client.prisma.publicationBundle.create({
        data: {
            name: data.name,
            createdBy: data.userId,
            entries: {
                create: data.publicationIds.map((publicationId, idx) => ({
                    publication: { connect: { id: publicationId } },
                    position: idx
                }))
            }
        },
        include: {
            entries: {
                include: { publication: true },
                orderBy: {
                    position: 'asc'
                }
            }
        }
    });

export const edit = (id: string, data: I.EditPublicationBundleRequestBody) =>
    client.prisma.publicationBundle.update({
        where: { id },
        data: {
            name: data.name ?? undefined,
            entries: data.publicationIds
                ? {
                      deleteMany: {},
                      create: data.publicationIds.map((publicationId, idx) => ({
                          publication: { connect: { id: publicationId } },
                          position: idx
                      }))
                  }
                : undefined
        },
        include: {
            entries: {
                include: { publication: true },
                orderBy: {
                    position: 'asc'
                }
            }
        }
    });

export const get = (id: string) =>
    client.prisma.publicationBundle.findUnique({
        where: { id },
        include: {
            entries: {
                include: {
                    publication: {
                        include: {
                            versions: {
                                where: {
                                    isLatestLiveVersion: true
                                },
                                select: {
                                    title: true,
                                    publishedDate: true,
                                    user: {
                                        select: {
                                            firstName: true,
                                            lastName: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    position: 'asc'
                }
            }
        }
    });

export const deletePublicationBundle = (id: string) =>
    client.prisma.publicationBundle.delete({
        where: { id }
    });

export const getByUser = async (
    userId: string,
    filters?: I.GetPublicationBundlesByUserQueryParams
): Promise<{
    metadata: I.SearchResultMeta;
    data: Prisma.PublicationBundleGetPayload<{ include: { entries: true } }>[];
}> => {
    const where: Prisma.PublicationBundleWhereInput = {
        createdBy: userId
    };
    const bundles = await client.prisma.publicationBundle.findMany({
        where,
        include: {
            entries: true
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: filters?.limit ?? 10,
        skip: filters?.offset ?? 0
    });
    const total = await client.prisma.publicationBundle.count({
        where
    });

    return {
        metadata: {
            total,
            limit: filters?.limit ?? 10,
            offset: filters?.offset ?? 0
        },
        data: bundles
    };
};
