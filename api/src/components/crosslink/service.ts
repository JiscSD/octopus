import { Prisma } from '@prisma/client';

import * as client from 'lib/client';
import * as I from 'interface';

export const create = (publications: [string, string], userId: string) =>
    client.prisma.crosslink.create({
        data: {
            publicationFromId: publications[0],
            publicationToId: publications[1],
            createdBy: userId
        },
        select: {
            id: true
        }
    });

const publicationIncludeForGetFunctions = {
    select: {
        id: true,
        versions: {
            where: {
                isLatestLiveVersion: true
            },
            select: {
                title: true
            }
        }
    }
};

const crosslinkGetBaseArgs = {
    include: {
        publicationFrom: publicationIncludeForGetFunctions,
        publicationTo: publicationIncludeForGetFunctions,
        votes: {
            select: {
                createdBy: true,
                vote: true
            }
        }
    }
};

type GetCrosslinkPublication = { id: string; title: string | null };

const simplifyCrosslinkForGetFunctions = (
    rawCrosslink: Prisma.CrosslinkGetPayload<typeof crosslinkGetBaseArgs> | null
): {
    id: string;
    publications: [GetCrosslinkPublication, GetCrosslinkPublication];
    upvotes: number;
    downvotes: number;
    createdBy: string;
    createdAt: Date;
} | null => {
    return rawCrosslink
        ? {
              id: rawCrosslink.id,
              publications: [
                  { id: rawCrosslink.publicationFrom.id, title: rawCrosslink.publicationFrom.versions[0].title },
                  { id: rawCrosslink.publicationTo.id, title: rawCrosslink.publicationTo.versions[0].title }
              ],
              upvotes: rawCrosslink.votes.filter((vote) => vote.vote).length,
              downvotes: rawCrosslink.votes.filter((vote) => !vote.vote).length,
              createdBy: rawCrosslink.createdBy,
              createdAt: rawCrosslink.createdAt
          }
        : null;
};

export const getById = async (id: string) => {
    const rawCrosslink = await client.prisma.crosslink.findUnique({
        where: {
            id
        },
        ...crosslinkGetBaseArgs
    });

    return simplifyCrosslinkForGetFunctions(rawCrosslink);
};

export const getByPublicationPair = async (publications: [string, string]) => {
    const rawCrosslink = await client.prisma.crosslink.findFirst({
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
        },
        ...crosslinkGetBaseArgs
    });

    return simplifyCrosslinkForGetFunctions(rawCrosslink);
};

export const deleteCrosslink = (id: string) =>
    client.prisma.crosslink.delete({
        where: {
            id
        }
    });

export const exists = async (crosslinkId: string) => {
    return Boolean(await client.prisma.crosslink.findUnique({ where: { id: crosslinkId } }));
};

const updateScore = async (crosslinkId: string) => {
    const crosslink = await client.prisma.crosslink.findUnique({
        where: {
            id: crosslinkId
        },
        select: {
            votes: {
                select: {
                    vote: true
                }
            }
        }
    });

    if (!crosslink) {
        return false;
    }

    const score = crosslink.votes
        .map((vote) => vote.vote)
        .reduce((accumulator, currentValue) => accumulator + (currentValue ? 1 : -1), 0);

    return await client.prisma.crosslink.update({
        where: {
            id: crosslinkId
        },
        data: {
            score
        }
    });
};

export const setVote = async (crosslinkId: string, userId: string, vote: boolean) => {
    const updateVote = await client.prisma.crosslinkVote.upsert({
        where: {
            crosslinkId_createdBy: {
                crosslinkId,
                createdBy: userId
            }
        },
        update: {
            vote
        },
        create: {
            crosslinkId,
            createdBy: userId,
            vote
        }
    });
    await updateScore(crosslinkId);

    return updateVote;
};

export const resetVote = async (crosslinkId: string, userId: string) => {
    const deleteVote = await client.prisma.crosslinkVote.delete({
        where: {
            crosslinkId_createdBy: {
                crosslinkId,
                createdBy: userId
            }
        }
    });
    await updateScore(crosslinkId);

    return deleteVote;
};

export const getVote = (crosslinkId: string, userId: string) =>
    client.prisma.crosslinkVote.findUnique({
        where: {
            crosslinkId_createdBy: {
                crosslinkId,
                createdBy: userId
            }
        }
    });

type GetPublicationCrosslinksQueryResult = {
    id: string;
    linked_publication_id: string;
    created_by: string;
    created_at: string;
    score: number;
    linked_publication_latest_live_version_id: string;
    linked_publication_title: string;
    linked_publication_published_date: string;
    linked_publication_author_id: string;
    linked_publication_author_first_name: string;
    linked_publication_author_last_name: string;
};

type RelativeCrosslink = {
    id: string;
    score: number;
    createdBy: string;
    createdAt: string;
    linkedPublication: Pick<I.Publication, 'id'> & {
        latestLiveVersion: Pick<I.PublicationVersion, 'title'> & {
            user: Pick<I.User, 'id' | 'firstName' | 'lastName'>;
        };
    };
};
interface GetPublicationCrosslinksQueryOptions extends I.GetPublicationCrosslinksOptions {
    excludedPublicationIds?: string[];
}

const buildPublicationCrosslinksFromClause = (
    options: { publicationId: string } & GetPublicationCrosslinksQueryOptions
): Prisma.Sql => {
    const { publicationId, order, search, limit, offset, userIdFilter, excludedPublicationIds } = options;

    return Prisma.sql`FROM get_publication_crosslinks(${publicationId}, ${userIdFilter || null}, ${search || null}, ${
        excludedPublicationIds || []
    }, ${order || null}, ${limit || null}::INTEGER, ${offset || 0}::INTEGER);
    `;
};

const getPublicationCrosslinksQuery = async (
    publicationId: string,
    options?: GetPublicationCrosslinksQueryOptions
): Promise<{
    results: RelativeCrosslink[];
    total: number;
}> => {
    // Get crosslinks and count using stored function.
    const fromClause = buildPublicationCrosslinksFromClause({ publicationId, ...options, limit: options?.limit || 10 });
    const crosslinks = await client.prisma.$queryRaw<GetPublicationCrosslinksQueryResult[]>`SELECT * ${fromClause}`;

    // Get total count.
    const totalFromClause = buildPublicationCrosslinksFromClause({ publicationId, ...options, limit: undefined });
    const totalQueryResults = await client.prisma.$queryRaw<[{ count: number }]>`SELECT count(*) ${totalFromClause}`;

    // This looks bad but the count comes back as a "bigint" type.
    // Treating it as a number right away causes errors in JSON serialization, so have to convert it properly.
    const total = Number.parseInt(String(totalQueryResults[0].count));

    // Get CoAuthors.
    const versionIds = crosslinks.map((crosslink) => crosslink.linked_publication_latest_live_version_id);
    const coAuthors = await client.prisma.coAuthors.findMany({
        where: {
            publicationVersionId: {
                in: versionIds
            }
        },
        select: {
            publicationVersionId: true,
            linkedUser: true,
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                    role: true
                }
            }
        }
    });

    // Map SQL results to return format.
    const results = crosslinks.map((rawCrosslink) => ({
        id: rawCrosslink.id,
        linkedPublication: {
            id: rawCrosslink.linked_publication_id,
            latestLiveVersion: {
                title: rawCrosslink.linked_publication_title,
                publishedDate: rawCrosslink.linked_publication_published_date,
                user: {
                    id: rawCrosslink.linked_publication_author_id,
                    firstName: rawCrosslink.linked_publication_author_first_name,
                    lastName: rawCrosslink.linked_publication_author_last_name
                },
                coAuthors: coAuthors
                    .filter(
                        (coAuthor) =>
                            coAuthor.publicationVersionId === rawCrosslink.linked_publication_latest_live_version_id
                    )
                    .map((coAuthor) => {
                        const { publicationVersionId, ...rest } = coAuthor;

                        return rest;
                    })
            }
        },
        score: rawCrosslink.score,
        createdBy: rawCrosslink.created_by,
        createdAt: rawCrosslink.created_at
    }));

    return {
        results,
        total
    };
};

export const getPublicationCrosslinks = async (
    publicationId: string,
    options?: I.GetPublicationCrosslinksOptions
): Promise<{
    data:
        | {
              recent: RelativeCrosslink[];
              relevant: RelativeCrosslink[];
          }
        | RelativeCrosslink[];
    metadata: I.SearchResultMeta;
}> => {
    const { order, limit, offset } = options || {};

    if (order === 'mix') {
        const recent = await getPublicationCrosslinksQuery(publicationId, {
            ...options,
            order: 'recent',
            limit: 2
        });
        const relevant = await getPublicationCrosslinksQuery(publicationId, {
            ...options,
            order: 'relevant',
            limit: 3,
            excludedPublicationIds: recent.results.map((crosslink) => crosslink.linkedPublication.id)
        });

        return {
            data: {
                recent: recent.results,
                relevant: relevant.results
            },
            metadata: {
                total: recent.total, // Because IDs are excluded from the relevant query, use the count from the recent query.
                limit: 5,
                offset: 0
            }
        };
    } else {
        const crosslinks = await getPublicationCrosslinksQuery(publicationId, options);

        return {
            data: crosslinks.results,
            metadata: {
                total: crosslinks.total,
                limit: limit || 10,
                offset: offset || 0
            }
        };
    }
};
