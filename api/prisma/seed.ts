import htmlToText from 'html-to-text';
import s3 from '../src/lib/s3';
import * as sqs from '../src/lib/sqs';
import * as SeedData from './seeds';
import * as client from '../src/lib/client';

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
    for (const publication of SeedData.publicationsDevSeedData) {
        await client.prisma.publication.create({
            // @ts-ignore
            data: publication
        });

        if (publication.currentStatus === 'LIVE') {
            await client.search.create({
                index: 'publications',
                id: publication.id,
                body: {
                    id: publication.id,
                    type: publication.type,
                    title: publication.title,
                    licence: publication.licence,
                    description: publication.description,
                    keywords: publication.keywords,
                    content: publication.content,
                    language: 'en',
                    currentStatus: publication.currentStatus,
                    publishedDate: publication.publishedDate,
                    cleanContent: htmlToText.convert(publication.content)
                }
            });
        }
    }

    for (const problem of SeedData.problems) {
        await client.prisma.publication.create({
            // @ts-ignore
            data: problem
        });

        if (problem.currentStatus === 'LIVE') {
            await client.search.create({
                index: 'publications',
                id: problem.id,
                body: {
                    id: problem.id,
                    type: problem.type,
                    title: problem.title,
                    licence: problem.licence,
                    description: problem.description,
                    keywords: problem.keywords,
                    content: problem.content,
                    language: 'en',
                    currentStatus: problem.currentStatus,
                    publishedDate: problem.publishedDate,
                    cleanContent: htmlToText.convert(problem.content)
                }
            });
        }
    }

    if (process.env.STAGE === 'local') {
        // create S3 bucket locally for image uploads

        try {
            await s3
                .getBucketAcl({
                    Bucket: `science-octopus-publishing-images-${process.env.STAGE}`
                })
                .promise();
            console.log('Bucket already exists');
        } catch (err) {
            // Bucket does not exist, therefor create
            await s3
                .createBucket({
                    Bucket: `science-octopus-publishing-images-${process.env.STAGE}`
                })
                .promise();
            console.log('Bucket created');
        }

        // create S3 bucket locally for PDF uploads
        try {
            await s3
                .getBucketAcl({
                    Bucket: `science-octopus-publishing-pdfs-${process.env.STAGE}`
                })
                .promise();
            console.log('Bucket already exists');
        } catch (err) {
            // Bucket does not exist, therefor create
            await s3
                .createBucket({
                    Bucket: `science-octopus-publishing-pdfs-${process.env.STAGE}`
                })
                .promise();
            console.log('Bucket created');
        }

        try {
            await sqs.getQueue('science-octopus-pdf-queue-local');
            console.log('Queue already exists');
        } catch (err) {
            await sqs.createQueue();
            console.log('Queue created');
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
        await client.prisma.publication.create({
            // @ts-ignore
            data: problem
        });

        if (problem.currentStatus === 'LIVE') {
            await client.search.create({
                index: 'publications',
                id: problem.id,
                body: {
                    id: problem.id,
                    type: problem.type,
                    title: problem.title,
                    licence: problem.licence,
                    description: problem.description,
                    keywords: problem.keywords,
                    content: problem.content,
                    language: 'en',
                    currentStatus: problem.currentStatus,
                    publishedDate: problem.publishedDate,
                    cleanContent: htmlToText.convert(problem.content)
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
