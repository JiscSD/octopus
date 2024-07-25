import { Prisma } from '@prisma/client';

const events: Prisma.EventCreateInput[] = [
    {
        id: 'test-control-request',
        type: 'REQUEST_CONTROL',
        data: {
            requesterId: 'test-user-2',
            publicationVersion: {
                id: 'publication-problem-live-2-v2',
                versionOf: 'publication-problem-live-2'
            }
        }
    }
];

export default events;
