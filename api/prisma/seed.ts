import { convert } from 'html-to-text';
import { Prisma } from '@prisma/client';
import * as s3 from '../src/lib/s3';
import * as sqs from '../src/lib/sqs';
import * as SeedData from './seeds';
import * as client from '../src/lib/client';

import { CreateBucketCommand, GetBucketAclCommand } from '@aws-sdk/client-s3';

const createPublications = async (publications: Prisma.PublicationCreateInput[]): Promise<void> => {
    for (const seedPublication of publications) {
        const createdPublication = await client.prisma.publication.create({
            data: seedPublication,
            include: {
                versions: {
                    where: {
                        isLatestVersion: true
                    },
                    select: {
                        title: true,
                        description: true,
                        keywords: true,
                        content: true,
                        currentStatus: true,
                        publishedDate: true,
                        user: {
                            select: {
                                role: true
                            }
                        }
                    }
                }
            }
        });

        const latestVersion = createdPublication.versions[0];

        // always populate search with the latest versions beside "id" and "type"
        if (latestVersion.currentStatus === 'LIVE') {
            await client.search.create({
                index: 'publications',
                id: createdPublication.id,
                body: {
                    id: createdPublication.id,
                    type: createdPublication.type,
                    title: latestVersion.title,
                    organisationalAuthor: latestVersion.user.role === 'ORGANISATION',
                    description: latestVersion.description,
                    keywords: latestVersion.keywords,
                    content: latestVersion.content,
                    publishedDate: latestVersion.publishedDate,
                    cleanContent: convert(latestVersion.content)
                }
            });
        }
    }
};

// Create topics - one by one because they can relate to each other
const createTopics = async (): Promise<void> => {
    for (const topic of SeedData.devTopics) {
        await client.prisma.topic.create({
            data: topic
        });
    }
};

export const initialDevSeed = async (): Promise<void> => {
    // Create basic users. These are relied upon when creating publications.
    await client.prisma.user.createMany({ data: SeedData.devUsers });

    const doesIndexExist = await client.search.indices.exists({
        index: 'publications'
    });

    if (doesIndexExist.body) {
        await client.search.indices.delete({
            index: 'publications'
        });
    }

    await Promise.all([
        createPublications(SeedData.devProblems),
        createPublications(SeedData.devOtherPublications),
        createTopics()
    ]);

    // Add topic mappings and organisational accounts - these depend on topics.
    await Promise.all([
        client.prisma.topicMapping.createMany({ data: SeedData.devTopicMappings }),
        client.prisma.user.createMany({ data: SeedData.devOrganisationalAccounts })
    ]);

    // Add organisational account mappings, which depend on organisational accounts.
    await client.prisma.userMapping.createMany({ data: SeedData.devUserMappings });

    if (process.env.STAGE === 'local') {
        // Create local S3 buckets
        for (const bucketNameSegment in s3.buckets) {
            const bucketName = s3.buckets[bucketNameSegment];

            try {
                await s3.client.send(
                    new GetBucketAclCommand({
                        Bucket: bucketName
                    })
                );
                console.log(`${bucketNameSegment} bucket already exists`);
            } catch (err) {
                // Bucket does not exist, therefore create
                await s3.client.send(
                    new CreateBucketCommand({
                        Bucket: bucketName
                    })
                );
                console.log(`${bucketNameSegment} bucket created`);
            }
        }

        // Create local PDF generation queue
        try {
            await sqs.getQueue(`pdf-generation-queue-${process.env.STAGE}-octopus`);
            console.log('PDF queue already exists');
        } catch (err) {
            await sqs.createQueue();
            console.log('PDF queue created');
        }
    }
};

export const initialProdSeed = async (): Promise<void> => {
    console.log('running initialProdSeed');
    // Create users
    await client.prisma.user.createMany({ data: SeedData.prodUsers });

    const doesIndexExist = await client.search.indices.exists({
        index: 'publications'
    });

    if (doesIndexExist.body) {
        await client.search.indices.delete({
            index: 'publications'
        });
    }

    for (const problem of SeedData.prodPublications) {
        const publication = await client.prisma.publication.create({
            data: problem,
            include: {
                versions: {
                    where: {
                        isLatestVersion: true
                    }
                }
            }
        });

        const latestVersion = publication.versions[0];

        // always populate search with the latest versions beside "id" and "type"
        if (latestVersion.currentStatus === 'LIVE') {
            await client.search.create({
                index: 'publications',
                id: publication.id,
                body: {
                    id: publication.id,
                    type: publication.type,
                    title: latestVersion.title,
                    licence: latestVersion.licence,
                    description: latestVersion.description,
                    keywords: latestVersion.keywords,
                    content: latestVersion.content,
                    language: 'en',
                    currentStatus: latestVersion.currentStatus,
                    publishedDate: latestVersion.publishedDate,
                    cleanContent: convert(latestVersion.content)
                }
            });
        }
    }
};

const disconnect = (): Promise<void> => client.prisma.$disconnect();

switch (process.env.STAGE) {
    case 'prod':
        initialProdSeed()
            .catch((e) => {
                console.error(e);
                // process.exit(1);
            })
            .finally(() => {
                disconnect().catch((error) => console.log(error));
            });

        break;
    default:
        initialDevSeed()
            .catch((e) => {
                console.error(e);
                // process.exit(1);
            })
            .finally(() => {
                disconnect().catch((error) => console.log(error));
            });
}
