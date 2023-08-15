import * as client from 'lib/client';
import * as I from 'interface';

export const create = async (e: I.CreateTopicRequestBody) => {
    const topic = await client.prisma.topic.create({
        data: {
            title: e.title,
            language: e.language,
            parents: {
                connect: e.parentIds.map((parentId) => ({ id: parentId }))
            },
            translations: e.translations?.length
                ? {
                      create: e.translations
                  }
                : undefined
        },
        include: {
            parents: {
                select: {
                    id: true,
                    title: true,
                    language: true,
                    translations: true
                }
            },
            translations: true
        }
    });

    return topic;
};

export const get = async (id: string) => {
    const topic = await client.prisma.topic.findFirst({
        where: {
            id
        },
        include: {
            translations: true,
            parents: {
                select: {
                    id: true,
                    title: true,
                    language: true,
                    translations: true
                }
            },
            children: {
                select: {
                    id: true,
                    title: true,
                    language: true,
                    translations: true
                }
            },
            publications: {
                select: {
                    id: true,
                    title: true
                },
                where: {
                    currentStatus: 'LIVE'
                }
            }
        }
    });

    return topic;
};
