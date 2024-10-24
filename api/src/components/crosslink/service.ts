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

export const getPublicationCrosslinks = async (publicationId: string, options?: I.GetPublicationCrosslinksOptions) => {
    const { order, search, limit, offset, userIdFilter } = options || {};
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
                            id: true,
                            firstName: true,
                            lastName: true
                        }
                    },
                    coAuthors: {
                        select: {
                            linkedUser: true,
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    role: true
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    // If a query term is supplied, match against the latest live title of the
    // crosslinked publication, i.e. not the one whose publicationId was supplied.
    const where: Prisma.CrosslinkWhereInput = {
        ...(search
            ? {
                  OR: [
                      {
                          publicationFromId: publicationId,
                          publicationTo: {
                              versions: {
                                  some: {
                                      isLatestLiveVersion: true,
                                      title: {
                                          search: search + ':*'
                                      }
                                  }
                              }
                          }
                      },
                      {
                          publicationToId: publicationId,
                          publicationFrom: {
                              versions: {
                                  some: {
                                      isLatestLiveVersion: true,
                                      title: {
                                          search: search + ':*'
                                      }
                                  }
                              }
                          }
                      }
                  ]
              }
            : {
                  OR: [
                      {
                          publicationFromId: publicationId
                      },
                      {
                          publicationToId: publicationId
                      }
                  ]
              }),
        ...(userIdFilter ? { createdBy: userIdFilter } : {})
    };

    let rawCrosslinks;

    if (order === 'mix') {
        const recent = await client.prisma.crosslink.findMany({
            where,
            include: {
                publicationFrom: publicationInclude,
                publicationTo: publicationInclude
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 2
        });
        const recentIds = recent.map((crosslink) => crosslink.id);
        const relevant = await client.prisma.crosslink.findMany({
            where: {
                ...where,
                id: {
                    not: {
                        in: recentIds
                    }
                }
            },
            include: {
                publicationFrom: publicationInclude,
                publicationTo: publicationInclude
            },
            orderBy: {
                score: 'desc'
            },
            take: 3
        });
        rawCrosslinks = [...recent, ...relevant];
    } else {
        const orderBy: Prisma.CrosslinkOrderByWithRelationAndSearchRelevanceInput =
            order === 'relevant'
                ? {
                      score: 'desc'
                  }
                : {
                      createdAt: 'desc'
                  };
        rawCrosslinks = await client.prisma.crosslink.findMany({
            where,
            include: {
                publicationFrom: publicationInclude,
                publicationTo: publicationInclude
            },
            orderBy,
            take: limit,
            skip: offset
        });
    }

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

        return {
            id: crosslink.id,
            linkedPublication: linkedPublicationWithSquashedVersion,
            score: crosslink.score,
            createdBy: crosslink.createdBy,
            createdAt: crosslink.createdAt
        };
    });

    // Sort data.
    const sortedCrosslinks =
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
            : crosslinks;

    // Get total count.
    const totalCrosslinks = await client.prisma.crosslink.count({ where });

    return {
        data: sortedCrosslinks,
        metadata: {
            total: totalCrosslinks,
            limit,
            offset
        }
    };
};
