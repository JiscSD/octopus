import supertest from 'supertest';

import prisma from 'lib/client';
import * as seeds from 'prisma/seeds';

jest.setTimeout(60000);

export const agent = supertest.agent(`http://0.0.0.0:4003/${process.env.stage}/v1`);

export const initialSeed = async (): Promise<void> => {
    await prisma.user.createMany({ data: seeds.users });
    await prisma.user.createMany({ data: seeds.usersNew });

    // not ideal, but best thing I can do right now. For some reason createMany will not work with provided seed data...
    for (let publication of seeds.publicationsNew) {
        await prisma.publication.create({
            // @ts-ignore
            data: publication
        });
    }

    // not ideal, but best thing I can do right now. For some reason createMany will not work with provided seed data...
    for (let publication of seeds.publications) {
        await prisma.publication.create({
            // @ts-ignore
            data: publication
        });
    }
};

export const clearDB = async (): Promise<void> => {
    const deletePublicationStatuses = prisma.publicationStatus.deleteMany();
    const deletePublications = prisma.publication.deleteMany();
    const deleteUsers = prisma.user.deleteMany();

    // @ts-ignore
    await prisma.$transaction([deleteUsers, deletePublications, deletePublicationStatuses]);
};
