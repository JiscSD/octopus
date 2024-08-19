import * as client from 'lib/client';
import * as I from 'interface';

export const get = (value: string, source: I.PublicationImportSource) =>
    client.prisma.userMapping.findFirst({
        where: {
            value: {
                equals: value,
                mode: 'insensitive'
            },
            source
        },
        select: {
            value: true,
            source: true,
            user: {
                select: {
                    id: true,
                    firstName: true,
                    defaultTopic: {
                        select: {
                            id: true,
                            title: true
                        }
                    }
                }
            }
        }
    });
