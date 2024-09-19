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

export const getMostRecentStartTime = async (source: I.PublicationImportSource): Promise<Date | null> => {
    const mostRecentStartQuery = await client.prisma.ingestLog.findFirst({
        where: {
            source,
            // Successful runs only.
            end: {
                not: null
            }
        },
        orderBy: {
            start: 'desc'
        },
        select: {
            start: true
        }
    });

    if (mostRecentStartQuery) {
        return mostRecentStartQuery.start;
    } else {
        return null;
    }
};
