import supertest from 'supertest';

import * as client from 'lib/client';
import * as seeds from 'prisma/seeds';

jest.setTimeout(60000);

export const agent = supertest.agent(`http://0.0.0.0:4003/${process.env.STAGE}/v1`);

export const initialSeed = async (): Promise<void> => {
    await client.prisma.user.createMany({ data: seeds.users });

    // not ideal, but best thing I can do right now. For some reason createMany will not work with provided seed data...
    for (let publication of seeds.publications) {
        await client.prisma.publication.create({
            // @ts-ignore
            data: publication
        });
    }
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

// TODO: This was commented out?
export const clearDB = async (): Promise<void> => {
    const deletePublicationStatuses = client.prisma.publicationStatus.deleteMany();
    const deletePublications = client.prisma.publication.deleteMany();
    const deleteUsers = client.prisma.user.deleteMany();

    // @ts-ignore
    await prisma.$transaction([deleteUsers, deletePublications, deletePublicationStatuses]);
};
