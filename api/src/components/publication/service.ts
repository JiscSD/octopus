import { prisma } from 'lib/client';

export const getAll = async () => {
    const publications = await prisma.publication.findMany({});

    return publications;
};
