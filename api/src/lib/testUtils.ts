import supertest from 'supertest';
import { convert } from 'html-to-text';
import axios from 'axios';

import * as client from 'lib/client';
import * as seeds from 'prisma/seeds';

jest.setTimeout(60000);

export const agent = supertest.agent(`http://0.0.0.0:4003/${process.env.STAGE}/v1`);

// Seed the database with a smaller set of data, just enough to run the automated tests.
export const testSeed = async (): Promise<void> => {
    for (const user of seeds.testUsers) {
        await client.prisma.user.create({
            data: user
        });
    }

    for (const publication of seeds.testPublications) {
        await client.prisma.publication.create({
            data: publication
        });
    }

    for (const topic of seeds.testTopics) {
        await client.prisma.topic.create({
            data: topic
        });
    }

    await client.prisma.topicMapping.createMany({
        data: seeds.testTopicMappings
    });

    await client.prisma.references.createMany({
        data: seeds.testReferences
    });

    await client.prisma.bookmark.createMany({
        data: seeds.testBookmarks
    });

    await client.prisma.event.createMany({
        data: seeds.testEvents
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
                cleanContent: convert(latestLiveVersion.content)
            }
        });
    }
};

export const clearDB = async (): Promise<void> => {
    const deletePublicationStatuses = client.prisma.publicationStatus.deleteMany();
    const deletePublications = client.prisma.publication.deleteMany();
    const deleteTopics = client.prisma.topic.deleteMany();
    const deleteTopicMappings = client.prisma.topicMapping.deleteMany();
    const deleteUsers = client.prisma.user.deleteMany();
    const deleteBookmarks = client.prisma.publicationBookmarks.deleteMany();
    const deleteEvents = client.prisma.event.deleteMany();

    await client.prisma.$transaction([
        deleteUsers,
        deletePublications,
        deleteTopics,
        deleteTopicMappings,
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
