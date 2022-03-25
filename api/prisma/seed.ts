import { PrismaClient } from '@prisma/client';
import * as SeedData from './seeds';
import * as client from '../src/lib/client';
import htmlToText from 'html-to-text';

const prisma = new PrismaClient();

export const initialDevSeed = async (): Promise<void> => {
    // Create users
    await prisma.user.createMany({ data: SeedData.usersDevSeedData });

    await client.search.indices.delete({
        index: 'publications'
    });
    // Create publications
    // not ideal, but best thing I can do right now. For some reason createMany will not work with provided seed data...
    for (let publication of SeedData.publicationsDevSeedData) {
        await prisma.publication.create({
            // @ts-ignore
            data: publication
        });
        if (publication.currentStatus === 'LIVE') {
            await client.search.create({
                index: 'publications',
                id: publication.id,
                body: {
                    id: publication.id,
                    type: publication.type,
                    title: publication.title,
                    licence: publication.licence,
                    description: publication.description,
                    keywords: publication.keywords,
                    content: publication.content,
                    currentStatus: publication.currentStatus,
                    publishedDate: publication.publishedDate,
                    cleanContent: htmlToText.convert(publication.content)
                }
            });
        }
    }
};

initialDevSeed()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
