import { Prisma } from '@prisma/client';
import * as I from 'interface';
import * as client from 'lib/client';

export const get = async (id: string) => {
    const publicationVersion = client.prisma.publicationVersion.findFirst({
        where: {
            id
        },
        include: {
            publicationStatus: {
                select: {
                    status: true,
                    createdAt: true,
                    id: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            },
            funders: {
                select: {
                    id: true,
                    city: true,
                    country: true,
                    name: true,
                    link: true,
                    ror: true
                }
            },
            coAuthors: {
                select: {
                    id: true,
                    email: true,
                    linkedUser: true,
                    publicationVersionId: true,
                    confirmedCoAuthor: true,
                    approvalRequested: true,
                    createdAt: true,
                    reminderDate: true,
                    isIndependent: true,
                    affiliations: true,
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            orcid: true
                        }
                    }
                },
                orderBy: {
                    position: 'asc'
                }
            },
            user: {
                select: {
                    id: true,
                    orcid: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true
                }
            }
        }
    });

    return publicationVersion;
};

export const getCurrentVersionIdForPublication = async (publicationId: string) => {
    const currentVersion = await client.prisma.publicationVersion.findFirst({
        where: {
            versionOf: publicationId,
            isCurrent: true
        },
        select: {
            id: true
        }
    });

    if (!currentVersion) {
        throw Error('Current version not found for publication');
    }

    return currentVersion.id;
};

export const updateStatus = async (id: string, status: I.PublicationStatusEnum) => {
    const query = {
        where: {
            id
        },
        data: {
            currentStatus: status,
            publicationStatus: {
                create: {
                    status
                }
            },
            ...(status === 'LIVE' && { publishedDate: new Date().toISOString() })
        },
        include: {
            publicationStatus: {
                select: {
                    status: true,
                    createdAt: true,
                    id: true
                },
                orderBy: {
                    createdAt: Prisma.SortOrder.desc
                }
            },
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true
                }
            },
            publication: {
                select: {
                    type: true
                }
            }
        }
    };

    const updatedPublication = await client.prisma.publicationVersion.update(query);

    return updatedPublication;
};
