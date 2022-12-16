import supertest from 'supertest';

import * as client from 'lib/client';
import * as seeds from 'prisma/seeds';
import axios from 'axios';

jest.setTimeout(60000);

export const agent = supertest.agent(`http://0.0.0.0:4003/${process.env.STAGE}/v1`);

export const testSeed = async (): Promise<void> => {
    for (const user of seeds.users) {
        await client.prisma.user.create({
            // @ts-ignore
            data: user
        });
    }

    // not ideal, but best thing I can do right now. For some reason createMany will not work with provided seed data...
    for (const publication of seeds.publications) {
        await client.prisma.publication.create({
            // @ts-ignore
            data: publication
        });
    }

    await client.prisma.references.createMany({
        data: seeds.referencesSeedData
    });

    await client.prisma.publicationBookmarks.createMany({
        data: seeds.bookmarkedPublicationSeeds
    });
};

export const openSearchSeed = async () => {
    for (const publication of seeds.publicationsDevSeedData) {
        // only seed in live publications
        if (publication.currentStatus === 'LIVE') {
            await client.search.create({
                index: 'publications',
                id: publication.id,
                body: {
                    title: publication.title,
                    type: publication.type,
                    licence: publication.licence,
                    content: publication.content,
                    keywords: publication.keywords,
                    description: publication.description,
                    publishedDate: publication.publishedDate
                }
            });
        }
    }
};

export const clearDB = async (): Promise<void> => {
    const deletePublicationStatuses = client.prisma.publicationStatus.deleteMany();
    const deletePublications = client.prisma.publication.deleteMany();
    const deleteUsers = client.prisma.user.deleteMany();
    const deleteBookmarks = client.prisma.publicationBookmarks.deleteMany();

    await client.prisma.$transaction([deleteUsers, deletePublications, deleteBookmarks, deletePublicationStatuses]);

    const doesIndexExists = await client.search.indices.exists({
        index: 'publications'
    });

    if (doesIndexExists.body) {
        await client.search.indices.delete({
            index: 'publications'
        });
    }
};

export const getEmails = async (query: string): Promise<any> => {
    const emails = await axios.get(`http://${process.env.MAIL_SERVER}:8025/api/v2/search`, {
        params: {
            kind: 'to',
            query
        }
    });
    return emails?.data;
};
