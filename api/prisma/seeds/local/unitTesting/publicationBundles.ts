import { Prisma } from '@prisma/client';

const publicationBundleSeeds: Prisma.PublicationBundleUncheckedCreateInput[] = [
    {
        id: 'test-bundle',
        name: 'Test Bundle',
        publications: {
            connect: [{ id: 'publication-problem-live' }, { id: 'publication-problem-live-2' }]
        },
        createdBy: 'test-user-1',
        createdAt: new Date('2023-01-01T00:00:00Z')
    },
    {
        id: 'test-bundle-2',
        name: 'Test Bundle 2',
        publications: {
            connect: [{ id: 'publication-hypothesis-live' }, { id: 'publication-protocol-live' }]
        },
        createdBy: 'test-user-1',
        createdAt: new Date('2022-12-31T00:00:00Z')
    }
];

export default publicationBundleSeeds;
