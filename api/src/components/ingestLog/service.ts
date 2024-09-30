import * as client from 'lib/client';
import * as I from 'lib/interface';

export const create = (source: I.PublicationImportSource) => client.prisma.ingestLog.create({ data: { source } });

export const setEndTime = (id: string, end: Date) =>
    client.prisma.ingestLog.update({
        where: {
            id
        },
        data: {
            end
        }
    });

export const getMostRecentLog = (source: I.PublicationImportSource, includeOpenLogs?: boolean) =>
    client.prisma.ingestLog.findFirst({
        where: {
            source,
            // By default, get successful (having an end time) logs only.
            ...(includeOpenLogs ? {} : { end: { not: null } })
        },
        orderBy: {
            start: 'desc'
        }
    });
