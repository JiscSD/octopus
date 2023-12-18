import * as client from 'lib/client';
import * as s3 from 'lib/s3';
import {
    DeleteObjectCommand,
    ListObjectsCommand,
    ListObjectsV2CommandOutput,
    PutObjectCommand
} from '@aws-sdk/client-s3';
import { Prisma } from '@prisma/client';

const listSitemapBucket = async (): Promise<ListObjectsV2CommandOutput> => {
    return await s3.client.send(
        new ListObjectsCommand({
            Bucket: s3.buckets.sitemaps
        })
    );
};

export const generatePublicationSitemaps = async (): Promise<number> => {
    // The maximum number of URLs per sitemap (the maximum google can take in one go)
    const URL_LIMIT = 50000;
    const now = new Date().toISOString();
    const queryOptions: Prisma.PublicationFindManyArgs = {
        take: URL_LIMIT,
        where: {
            versions: {
                some: {
                    currentStatus: 'LIVE'
                }
            }
        },
        select: {
            id: true
        },
        orderBy: {
            id: 'asc'
        }
    };
    // Get publication IDs for first sitemap
    let queryResults = await client.prisma.publication.findMany(queryOptions);
    let sitemapCount = 0;

    // Put sitemap into S3 and fetch next sitemap's worth of pulication IDs using a cursor
    while (queryResults.length > 0) {
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                ${queryResults
                    .map(
                        (result) => `
                            <url>
                                <loc>${process.env.BASE_URL}/publications/${result.id}</loc>
                                <lastmod>${now}</lastmod>
                                <changefreq>daily</changefreq>
                                <priority>1.0</priority>
                            </url>
                        `
                    )
                    .join('')}
            </urlset>
        `;
        sitemapCount++;
        await s3.client.send(
            new PutObjectCommand({
                Bucket: s3.buckets.sitemaps,
                Key: `publications/${sitemapCount}.xml`,
                ContentType: 'text/xml',
                Body: sitemap
            })
        );
        queryResults = await client.prisma.publication.findMany({
            skip: 1,
            cursor: {
                id: queryResults[queryResults.length - 1].id
            },
            ...queryOptions
        });
    }

    // In case fewer sitemaps were generated than existed previously, clean up the old ones.
    // This should generally only occur locally.
    const bucketFiles = await listSitemapBucket();

    if (bucketFiles.Contents) {
        const publicationSitemapsInBucket = bucketFiles.Contents.filter(
            (file) => file.Key?.slice(0, 13) === 'publications/'
        );

        if (publicationSitemapsInBucket.length > sitemapCount) {
            for (const file of publicationSitemapsInBucket) {
                const fileNumber = Number(file.Key?.slice(13, -4));

                if (fileNumber > sitemapCount) {
                    await s3.client.send(
                        new DeleteObjectCommand({
                            Bucket: s3.buckets.sitemaps,
                            Key: file.Key
                        })
                    );
                }
            }
        }
    }

    return sitemapCount;
};

export const getUrls = async (): Promise<string[]> => {
    const bucketFiles = await listSitemapBucket();

    if (bucketFiles.Contents) {
        return bucketFiles.Contents.map((file) => `${s3.endpoint}/${s3.buckets.sitemaps}/${file.Key}`);
    }

    return [];
};
