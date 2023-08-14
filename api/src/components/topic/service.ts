import * as client from 'lib/client';
import * as I from 'interface';
import { Prisma } from '@prisma/client';

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
            }
        }
    });

    return topic;
};

export const getPaginatedResults = async (filters: I.TopicsFilters) => {
    const { offset = 0, limit = 10, search = '' } = filters;

    const where: Prisma.TopicWhereInput = {
        title: {
            contains: search?.trim(),
            mode: 'insensitive'
        }
    };

    const topics = await client.prisma.topic.findMany({
        where,
        skip: Math.abs(offset),
        take: Math.abs(limit),
        select: {
            id: true,
            title: true,
            createdAt: true
        }
    });

    const total = await client.prisma.topic.count({ where });

    return { offset, limit, total, results: topics };
};
