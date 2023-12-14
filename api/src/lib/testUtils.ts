import supertest from 'supertest';
import htmlToText from 'html-to-text';
import axios from 'axios';

import * as client from 'lib/client';
import * as seeds from 'prisma/seeds';

jest.setTimeout(60000);

export const agent = supertest.agent(`http://0.0.0.0:4003/${process.env.STAGE}/v1`);

/**
 * @TODO - use a smaller set of data for tests
 * - using such a large set of data for tests is unnecessary and it makes them very slow to run
 */

export const testSeed = async (): Promise<void> => {
    for (const user of seeds.users) {
        await client.prisma.user.create({
            data: user
        });
    }

    for (const publication of seeds.publications) {
        await client.prisma.publication.create({
            data: publication
        });
    }

    for (const topic of seeds.topicsDevSeedData) {
        await client.prisma.topic.create({
            data: topic
        });
    }

    await client.prisma.references.createMany({
        data: seeds.referencesSeedData
    });

    await client.prisma.bookmark.createMany({
        data: seeds.bookmarkSeeds
    });

    await client.prisma.event.createMany({
        data: seeds.events
    });
};

export const openSearchSeed = async (): Promise<void> => {
    const publications = await client.prisma.publication.findMany({
        where: {
            versions: {
                some: {
                    // only seed in live versions
                    isLatestLiveVersion: true
                }
            }
        },
        include: {
            versions: {
                where: {
                    isLatestLiveVersion: true
                }
            }
        }
    });

    for (const publication of publications) {
        const latestLiveVersion = publication.versions[0];

        await client.search.create({
            index: 'publications',
            id: publication.id,
            body: {
                id: publication.id,
                type: publication.type,
                title: latestLiveVersion.title,
                licence: latestLiveVersion.licence,
                description: latestLiveVersion.description,
                keywords: latestLiveVersion.keywords,
                content: latestLiveVersion.content,
                language: 'en',
                currentStatus: latestLiveVersion.currentStatus,
                publishedDate: latestLiveVersion.publishedDate,
                cleanContent: htmlToText.convert(latestLiveVersion.content)
            }
        });
    }
};

export const clearDB = async (): Promise<void> => {
    const deletePublicationStatuses = client.prisma.publicationStatus.deleteMany();
    const deletePublications = client.prisma.publication.deleteMany();
    const deleteTopics = client.prisma.topic.deleteMany();
    const deleteUsers = client.prisma.user.deleteMany();
    const deleteBookmarks = client.prisma.publicationBookmarks.deleteMany();
    const deleteEvents = client.prisma.event.deleteMany();

    await client.prisma.$transaction([
        deleteUsers,
        deletePublications,
        deleteTopics,
        deleteBookmarks,
        deletePublicationStatuses,
        deleteEvents
    ]);

    const doesIndexExists = await client.search.indices.exists({
        index: 'publications'
    });

    if (doesIndexExists.body) {
        await client.search.indices.delete({
            index: 'publications'
        });
    }
};

interface Inbox {
    items: {
        Content: {
            Headers: {
                Subject: string;
            };
            Body: string;
        };
    };
}

export const getEmails = async (query: string): Promise<Inbox> => {
    const emails = await axios.get(`http://${process.env.MAIL_SERVER}:8025/api/v2/search`, {
        params: {
            kind: 'to',
            query
        }
    });

    return emails?.data as Inbox;
};
