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

export const getByPublicationPair = (publications: [string, string]) =>
    client.prisma.crosslink.findFirst({
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

export const deleteCrosslink = (id: string) =>
    client.prisma.crosslink.delete({
        where: {
            id
        }
    });

export const get = async (id: string) => {
    const publicationInclude = {
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
    const rawCrosslink = await client.prisma.crosslink.findUnique({
        where: {
            id
        },
        include: {
            publicationFrom: publicationInclude,
            publicationTo: publicationInclude,
            votes: {
                select: {
                    createdBy: true,
                    vote: true
                }
            }
        }
    });

    // Simplify data.
    const crosslink = rawCrosslink
        ? {
              publications: [rawCrosslink.publicationFrom, rawCrosslink.publicationTo],
              upVotes: rawCrosslink.votes.filter((vote) => vote.vote).length,
              downVotes: rawCrosslink.votes.filter((vote) => !vote.vote).length,
              createdBy: rawCrosslink.createdBy,
              createdAt: rawCrosslink.createdAt
          }
        : null;

    return crosslink;
};

export const exists = async (crosslinkId: string) => {
    return Boolean(await client.prisma.crosslink.findUnique({ where: { id: crosslinkId } }));
};

export const setVote = (crosslinkId: string, userId: string, vote: boolean) =>
    client.prisma.crosslinkVote.upsert({
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

export const resetVote = (crosslinkId: string, userId: string) =>
    client.prisma.crosslinkVote.delete({
        where: {
            crosslinkId_createdBy: {
                crosslinkId,
                createdBy: userId
            }
        }
    });

export const getVote = (crosslinkId: string, userId: string) =>
    client.prisma.crosslinkVote.findUnique({
        where: {
            crosslinkId_createdBy: {
                crosslinkId,
                createdBy: userId
            }
        }
    });

export const getPublicationCrosslinks = async (publicationId: string, order?: I.GetPublicationCrosslinksOrder) => {
    const publicationInclude = {
        select: {
            id: true,
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
    };
    const rawCrosslinks = await client.prisma.crosslink.findMany({
        where: {
            OR: [
                {
                    publicationFromId: publicationId
                },
                {
                    publicationToId: publicationId
                }
            ]
        },
        include: {
            publicationFrom: publicationInclude,
            publicationTo: publicationInclude,
            votes: true
        },
        orderBy: { createdAt: 'desc' }
    });

    // Simplify data.
    const crosslinks = rawCrosslinks.map((crosslink) => {
        // Only return the other publication's details; we already know about the one whose ID was passed.
        const linkedPublication =
            crosslink.publicationFromId === publicationId ? crosslink.publicationTo : crosslink.publicationFrom;
        const { versions, ...linkedPublicationRest } = linkedPublication;
        const linkedPublicationWithSquashedVersion = {
            ...linkedPublicationRest,
            latestLiveVersion: versions[0] // Only the latest live version comes from the query.
        };
        // Calculate score (up votes minus down votes).
        const upCount = crosslink.votes.filter((vote) => vote.vote).length;
        const downCount = crosslink.votes.filter((vote) => !vote.vote).length;
        const score = upCount - downCount;

        return {
            linkedPublication: linkedPublicationWithSquashedVersion,
            score,
            createdBy: crosslink.createdBy,
            createdAt: crosslink.createdAt
        };
    });

    // Sort data.
    const sortedCrosslinks =
        // Relevant: order by score, descending.
        order === 'relevant'
            ? crosslinks.sort((a, b) => b.score - a.score)
            : // Mix: promote 2 most recent, then order by score, descending.
            order === 'mix'
            ? crosslinks.length <= 2
                ? {
                      recent: crosslinks,
                      relevant: []
                  }
                : {
                      recent: [crosslinks[0], crosslinks[1]],
                      relevant: [...crosslinks.slice(2).sort((a, b) => b.score - a.score)]
                  }
            : // Default: order by created date, descending.
              crosslinks;

    return sortedCrosslinks;
};
