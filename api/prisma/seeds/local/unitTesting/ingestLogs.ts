import { Prisma } from '@prisma/client';

const ingestLogs: Prisma.IngestLogCreateManyInput[] = [
    {
        id: 'ingest-log-1',
        source: 'ARI',
        start: '2024-09-11T12:53:00.000Z',
        end: '2024-09-11T12:54:00.000Z'
    }
];

export default ingestLogs;
