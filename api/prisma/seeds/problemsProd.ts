import { Prisma } from '@prisma/client';

const problems: Prisma.PublicationCreateInput[] = [
    {
        id: 'why',
        doi: '10.57874/why',
        type: 'PROBLEM',
        versions: {
            create: {
                id: 'why-v1',
                versionNumber: 1,
                title: 'What makes everything we can detect in the universe around us the way that it is, and why?',
                licence: 'CC_BY',
                conflictOfInterestStatus: false,
                content: 'What makes everything we can detect in the universe around us the way that it is, and why?',
                currentStatus: 'LIVE',
                publishedDate: '2022-06-30T12:00:00.523Z',
                description:
                    'What makes everything we can detect in the universe around us the way that it is, and why?',
                keywords: [],
                createdAt: '2022-06-30T11:00:00.523Z',
                updatedAt: '2022-06-30T12:00:00.523Z',
                user: {
                    connect: {
                        id: 'octopus'
                    }
                },
                publicationStatus: {
                    create: [
                        {
                            status: 'DRAFT',
                            createdAt: '2022-06-30T11:00:00.523Z'
                        },
                        {
                            status: 'LIVE',
                            createdAt: '2022-06-30T12:00:00.523Z'
                        }
                    ]
                },
                isLatestLiveVersion: true
            }
        }
    }
];

export default problems;
