import * as client from 'lib/client';
import * as I from 'interface';

export const create = async (e: I.CreateTopicRequestBody) => {
    const topic = await client.prisma.topic.create({
        data: {
            title: e.title,
            keywords: e.keywords,
            language: e.language,
            parentId: e.parentId,
            translations: e.translations?.length ? {
                create: e.translations
            } : undefined
        },
        include: {
            parent: {
                select: {
                    title: true
                }
            }
        }
    });

    return topic;
};