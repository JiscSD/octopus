import htmlToText from 'html-to-text';
import * as s3 from '../src/lib/s3';
import * as sqs from '../src/lib/sqs';
import * as SeedData from './seeds';
import * as client from '../src/lib/client';

import { CreateBucketCommand, GetBucketAclCommand } from '@aws-sdk/client-s3';

export const initialDevSeed = async (): Promise<void> => {
    // Create users
    await client.prisma.user.createMany({ data: SeedData.usersDevSeedData });

    const doesIndexExists = await client.search.indices.exists({
        index: 'publications'
    });

    if (doesIndexExists.body) {
        await client.search.indices.delete({
            index: 'publications'
        });
    }

    // Create publications
    for (const seedPublication of SeedData.publicationsDevSeedData) {
        const createdPublication = await client.prisma.publication.create({
            data: seedPublication,
            include: {
                versions: {
                    where: {
                        isLatestVersion: true
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
                    licence: latestVersion.licence,
                    description: latestVersion.description,
                    keywords: latestVersion.keywords,
                    content: latestVersion.content,
                    language: 'en',
                    currentStatus: latestVersion.currentStatus,
                    publishedDate: latestVersion.publishedDate,
                    cleanContent: htmlToText.convert(latestVersion.content)
                }
            });
        }
    }

    // Create topics - one by one because they can relate to each other
    for (const topic of SeedData.topicsDevSeedData) {
        await client.prisma.topic.create({
            data: topic
        });
    }

    for (const problem of SeedData.problems) {
        const createdProblem = await client.prisma.publication.create({
            data: problem,
            include: {
                versions: {
                    where: {
                        isLatestVersion: true
                    }
                }
            }
        });

        const latestVersion = createdProblem.versions[0];

        // always populate search with the latest versions beside "id" and "type"
        if (latestVersion.currentStatus === 'LIVE') {
            await client.search.create({
                index: 'publications',
                id: createdProblem.id,
                body: {
                    id: createdProblem.id,
                    type: createdProblem.type,
                    title: latestVersion.title,
                    licence: latestVersion.licence,
                    description: latestVersion.description,
                    keywords: latestVersion.keywords,
                    content: latestVersion.content,
                    language: 'en',
                    currentStatus: latestVersion.currentStatus,
                    publishedDate: latestVersion.publishedDate,
                    cleanContent: htmlToText.convert(latestVersion.content)
                }
            });
        }
    }

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
            await sqs.getQueue(`science-octopus-pdf-queue-${process.env.STAGE}`);
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
    await client.prisma.user.createMany({ data: SeedData.usersProdSeedData });

    const doesIndexExists = await client.search.indices.exists({
        index: 'publications'
    });

    if (doesIndexExists.body) {
        await client.search.indices.delete({
            index: 'publications'
        });
    }

    for (const problem of SeedData.problemsProd) {
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
                    cleanContent: htmlToText.convert(latestVersion.content)
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
