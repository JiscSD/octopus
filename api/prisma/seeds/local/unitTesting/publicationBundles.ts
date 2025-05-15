import { Prisma } from '@prisma/client';

const publicationBundleSeeds: Prisma.PublicationBundleUncheckedCreateInput[] = [
    {
        id: 'test-bundle',
        name: 'Test Bundle',
        publications: {
            connect: [{ id: 'publication-problem-live' }, { id: 'publication-problem-live-2' }]
        },
        createdBy: 'test-user-1'
    }
];

export default publicationBundleSeeds;
