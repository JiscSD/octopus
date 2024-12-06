import { Prisma } from '@prisma/client';
// import { getPublicationCrosslinks } from '@prisma/client/sql';

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
    linkedPublicationId: string;
    createdBy: string;
    createdAt: string;
    score: number;
    linkedPublicationLatestLiveVersionId: string;
    linkedPublicationTitle: string;
    linkedPublicationPublishedDate: string;
    linkedPublicationAuthorId: string;
    linkedPublicationAuthorFirstName: string;
    linkedPublicationAuthorLastName: string;
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

const getPublicationCrosslinksQuery = async (
    publicationId: string,
    options?: GetPublicationCrosslinksQueryOptions
): Promise<RelativeCrosslink[]> => {
    const { order, search, limit, offset, userIdFilter, excludedPublicationIds } = options || {};

    const conditionalFilterClauses: Prisma.Sql[] = [];
    // Some conditional filter clauses have to be tailored depending whether we are getting
    // crosslinks "from" or "to" the publication.
    const conditionalFilterClausesFrom: Prisma.Sql[] = [];
    const conditionalFilterClausesTo: Prisma.Sql[] = [];

    if (userIdFilter) {
        conditionalFilterClauses.push(Prisma.sql`c."createdBy" = ${userIdFilter}`);
    }

    if (search) {
        conditionalFilterClauses.push(Prisma.sql`to_tsvector('english', pv.title) @@ to_tsquery('english', ${search})`);
    }

    if (excludedPublicationIds) {
        conditionalFilterClausesTo.push(
            Prisma.sql`c."publicationToId" NOT IN (${Prisma.join(excludedPublicationIds)})`
        );
        conditionalFilterClausesFrom.push(
            Prisma.sql`c."publicationFromId" NOT IN (${Prisma.join(excludedPublicationIds)})`
        );
    }

    const conditionalWhereTo =
        conditionalFilterClauses.length || conditionalFilterClausesTo.length
            ? Prisma.sql`AND ${Prisma.join([...conditionalFilterClauses, ...conditionalFilterClausesTo], ' AND ')}`
            : Prisma.empty;
    const conditionalWhereFrom =
        conditionalFilterClauses.length || conditionalFilterClausesFrom.length
            ? Prisma.sql`AND ${Prisma.join([...conditionalFilterClauses, ...conditionalFilterClausesFrom], ' AND ')}`
            : Prisma.empty;

    const crosslinks = await client.prisma.$queryRaw<GetPublicationCrosslinksQueryResult[]>`
        SELECT * FROM (
            SELECT
                c.id,
                c."publicationToId" AS "linkedPublicationId",
                c."createdBy",
                c."createdAt",
                c.score,
                pv.id AS "linkedPublicationLatestLiveVersionId",
                pv.title AS "linkedPublicationTitle",
                pv."publishedDate" AS "linkedPublicationPublishedDate",
                pvu.id AS "linkedPublicationAuthorId",
                pvu."firstName" AS "linkedPublicationAuthorFirstName",
                pvu."lastName" AS "linkedPublicationAuthorLastName"
            FROM "Crosslink" AS c
            JOIN "PublicationVersion" AS pv ON c."publicationToId" = pv."versionOf"
            JOIN "User" AS pvu ON pvu.id = pv."createdBy"
            WHERE
                c."publicationFromId" = ${publicationId}
                AND pv."isLatestLiveVersion" 
                ${conditionalWhereTo}
            UNION
            SELECT
                c.id,
                c."publicationFromId" AS linkedPublicationId,
                c."createdBy",
                c."createdAt",
                c.score,
                pv.id AS "linkedPublicationLatestLiveVersionId",
                pv.title AS linkedPublicationTitle,
                pv."publishedDate" AS "linkedPublicationPublishedDate",
                pvu.id AS "linkedPublicationAuthorId",
                pvu."firstName" AS "linkedPublicationAuthorFirstName",
                pvu."lastName" AS "linkedPublicationAuthorlastName"
            FROM "Crosslink" AS c
            JOIN "PublicationVersion" AS pv ON c."publicationFromId" = pv."versionOf"
            JOIN "User" AS pvu ON pvu.id = pv."createdBy"
            WHERE
                c."publicationToId" = ${publicationId}
                AND pv."isLatestLiveVersion"
                ${conditionalWhereFrom}
        ) AS crosslinks
        --- Recency order is default and also used to order results with the same score when
        --- sorting by relevance.
        ORDER BY
            (CASE WHEN ${order} = 'relevant' THEN score END) DESC,
            "createdAt" DESC
        LIMIT ${limit || 10}
        OFFSET ${offset || 0};
    `;

    const versionIds = crosslinks.map((crosslink) => crosslink.linkedPublicationLatestLiveVersionId);
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

    // TODO: Confirm coauthors are returned properly (seed data doesn't have coauthors)
    // TODO: Provide a total result count

    return crosslinks.map((rawCrosslink) => ({
        id: rawCrosslink.id,
        linkedPublication: {
            id: rawCrosslink.linkedPublicationId,
            latestLiveVersion: {
                title: rawCrosslink.linkedPublicationTitle,
                publishedDate: rawCrosslink.linkedPublicationPublishedDate,
                user: {
                    id: rawCrosslink.linkedPublicationAuthorId,
                    firstName: rawCrosslink.linkedPublicationAuthorFirstName,
                    lastName: rawCrosslink.linkedPublicationAuthorLastName
                },
                coAuthors: coAuthors
                    .filter(
                        (coAuthor) =>
                            coAuthor.publicationVersionId === rawCrosslink.linkedPublicationLatestLiveVersionId
                    )
                    .map((coAuthor) => {
                        const { publicationVersionId, ...rest } = coAuthor;

                        return rest;
                    })
            }
        },
        score: rawCrosslink.score,
        createdBy: rawCrosslink.createdBy,
        createdAt: rawCrosslink.createdAt
    }));
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
        console.log(recent);
        const relevant = await getPublicationCrosslinksQuery(publicationId, {
            ...options,
            order: 'relevant',
            limit: 3,
            excludedPublicationIds: recent.map((crosslink) => crosslink.linkedPublication.id)
        });

        return {
            data: {
                recent,
                relevant
            }
        };
    } else {
        const crosslinks = await getPublicationCrosslinksQuery(publicationId, options);

        return {
            data: crosslinks,
            metadata: {
                total: 0,
                limit: limit || 10,
                offset: offset || 0
            }
        };
    }
};
