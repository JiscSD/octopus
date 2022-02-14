import { PrismaClient } from '@prisma/client';
import * as SeedData from './seeds';

const prisma = new PrismaClient();

export const initialDevSeed = async (): Promise<void> => {
    // Create users
    await prisma.user.createMany({ data: SeedData.usersDevSeedData });

    // Create publications
    // not ideal, but best thing I can do right now. For some reason createMany will not work with provided seed data...
    for (let publication of SeedData.publicationsDevSeedData) {
        await prisma.publication.create({
            // @ts-ignore
            data: publication
        });
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
