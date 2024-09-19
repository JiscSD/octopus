import * as client from 'lib/client';
import * as I from 'interface';

export const get = (title: string, source: I.PublicationImportSource) =>
    client.prisma.topicMapping.findFirst({
        where: {
            title: {
                equals: title,
                mode: 'insensitive'
            },
            source
        },
        select: {
            title: true,
            source: true,
            isMapped: true,
            topic: {
                select: {
                    id: true,
                    title: true
                }
            }
        }
    });
