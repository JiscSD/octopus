import * as client from 'lib/client';
import * as I from 'interface';
import { Prisma } from '@prisma/client';

export const get = (id: string, includePublicationVersions?: boolean) =>
    client.prisma.topic.findFirst({
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
            ...(includePublicationVersions
                ? {
                      publicationVersions: {
                          where: {
                              isLatestLiveVersion: true
                          },
                          select: {
                              id: true,
                              title: true,
                              versionOf: true
                          }
                      }
                  }
                : {})
        }
    });

export const getPaginatedResults = async (filters: I.TopicsFilters) => {
    const { offset = 0, limit = 10, search = '', exclude = '' } = filters;

    const where: Prisma.TopicWhereInput = {
        title: {
            contains: search?.trim(),
            mode: 'insensitive'
        },
        ...(exclude && { id: { notIn: exclude.split(',') } })
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
