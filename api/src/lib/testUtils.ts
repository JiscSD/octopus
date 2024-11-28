import supertest from 'supertest';
import { convert } from 'html-to-text';
import axios from 'axios';

import * as client from 'lib/client';
import * as seeds from 'prisma/seeds';

jest.setTimeout(60000);

export const agent = supertest.agent(`http://0.0.0.0:4003/${process.env.STAGE}/v1`);

const createPublications = async (): Promise<void> => {
    for (const publication of seeds.testPublications) {
        await client.prisma.publication.create({
            data: publication
        });
    }
};

const createTopics = async (): Promise<void> => {
    for (const topic of seeds.testTopics) {
        await client.prisma.topic.create({
            data: topic
        });
    }
};

const createUsers = async (): Promise<void> => {
    for (const user of seeds.testUsers) {
        await client.prisma.user.create({
            data: user
        });
    }
};

// Seed the database with a smaller set of data, just enough to run the automated tests.
export const testSeed = async (): Promise<void> => {
    // These don't depend on anything.
    await Promise.all([
        createUsers(),
        client.prisma.ingestLog.createMany({
            data: seeds.testIngestLogs
        })
    ]);
    // These depend on users.
    await Promise.all([
        createPublications(),
        client.prisma.userMapping.createMany({
            data: seeds.testUserMappings
        })
    ]);
    // These depend on publications.
    await Promise.all([
        createTopics(),
        client.prisma.references.createMany({
            data: seeds.testReferences
        }),
        client.prisma.event.createMany({
            data: seeds.testEvents
        })
    ]);
    // These depend on topics.
    await Promise.all([
        client.prisma.bookmark.createMany({
            data: seeds.testBookmarks
        }),
        client.prisma.topicMapping.createMany({
            data: seeds.testTopicMappings
        })
    ]);
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
                },
                select: {
                    title: true,
                    description: true,
                    keywords: true,
                    content: true,
                    publishedDate: true,
                    user: {
                        select: {
                            role: true
                        }
                    }
                }
            }
        }
    });

    await Promise.all(
        publications.map(async (publication) => {
            const latestLiveVersion = publication.versions[0];

            await client.search.create({
                index: 'publications',
                id: publication.id,
                body: {
                    id: publication.id,
                    type: publication.type,
                    title: latestLiveVersion.title,
                    organisationalAuthor: latestLiveVersion.user.role === 'ORGANISATION',
                    description: latestLiveVersion.description,
                    keywords: latestLiveVersion.keywords,
                    content: latestLiveVersion.content,
                    publishedDate: latestLiveVersion.publishedDate,
                    cleanContent: convert(latestLiveVersion.content)
                }
            });
        })
    );

    // Wait until things show up in the index.
    const maxWaitSeconds = 5;
    let waitSeconds = 0;

    do {
        const allResults = await client.search.search({ index: 'publications', body: { query: { match_all: {} } } });

        if (allResults.body.hits.total.value > 0) {
            return;
        } else {
            // Wait a second before trying again.
            await new Promise((resolve) => setTimeout(resolve, 1000));
            waitSeconds++;
        }
    } while (waitSeconds < maxWaitSeconds);

    // If index isn't populated by this time, something is wrong.
    throw new Error('Index not populated after seeding.');
};

export const clearDB = async (): Promise<void> => {
    await client.prisma.$transaction([
        client.prisma.event.deleteMany(),
        client.prisma.ingestLog.deleteMany(),
        client.prisma.publication.deleteMany(),
        client.prisma.user.deleteMany(),
        client.prisma.topic.deleteMany(),
        client.prisma.topicMapping.deleteMany(),
        client.prisma.publicationStatus.deleteMany()
    ]);

    const doesIndexExist = await client.search.indices.exists({
        index: 'publications'
    });

    if (doesIndexExist.body) {
        await client.search.indices.delete({
            index: 'publications'
        });
    }
};

interface MailpitEmailAddress {
    Name: string;
    Address: string;
}
interface MailpitEmailSearchResponse {
    total: number;
    unread: number;
    count: number;
    messages_count: number;
    start: number;
    tags: string[];
    messages: {
        ID: string;
        MessageID: string;
        Read: boolean;
        From: MailpitEmailAddress;
        To: MailpitEmailAddress[];
        Cc: MailpitEmailAddress[];
        Bcc: MailpitEmailAddress[];
        ReplyTo: MailpitEmailAddress[];
        Subject: string;
        Created: string;
        Tags: string[];
        Size: number;
        Attachments: number;
        Snippet: string;
    }[];
}

export const getEmails = async (query: string): Promise<MailpitEmailSearchResponse> => {
    const emails = await axios.get(`http://${process.env.MAIL_SERVER}:8025/api/v1/search`, {
        params: {
            query
        }
    });

    return emails?.data as MailpitEmailSearchResponse;
};

interface MailpitEmailResponse {
    ID: string;
    MessageID: string;
    From: MailpitEmailAddress;
    To: MailpitEmailAddress[];
    Cc: MailpitEmailAddress[];
    Bcc: MailpitEmailAddress[];
    ReplyTo: MailpitEmailAddress[];
    Subject: string;
    ListUnsubscribe: {
        Header: string;
        Links: string[];
        Errors: string;
        HeaderPost: string;
    };
    Date: string;
    Tags: string[];
    Text: string;
    HTML: string;
    Size: number;
}

export const getEmail = async (id = 'latest'): Promise<MailpitEmailResponse> => {
    const email = await axios.get(`http://${process.env.MAIL_SERVER}:8025/api/v1/message/${id}`);

    return email?.data as MailpitEmailResponse;
};
