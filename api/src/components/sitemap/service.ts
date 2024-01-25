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

export const generateSitemaps = async (category: 'publications' | 'users'): Promise<void> => {
    // The maximum number of URLs per sitemap (the maximum google can take in one go)
    const URL_LIMIT = 50000;
    // DB query options - publications should only be live ones, users can be any.
    const queryOptions: Prisma.PublicationFindManyArgs | Prisma.UserFindManyArgs = {
        take: URL_LIMIT,
        ...(category === 'publications' && {
            where: {
                versions: {
                    some: {
                        currentStatus: 'LIVE'
                    }
                }
            }
        }),
        select: {
            id: true
        },
        orderBy: {
            id: 'asc'
        }
    };

    // Get IDs for first sitemap
    let queryResults =
        category === 'publications'
            ? await client.prisma.publication.findMany(queryOptions )
            : await client.prisma.user.findMany(queryOptions as Prisma.UserFindManyArgs);
    let sitemapCount = 0;

    // Put sitemap into S3 and fetch next sitemap's worth of IDs using a cursor
    while (queryResults.length > 0) {
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                ${queryResults
                    .map(
                        (result) => `
                            <url>
                                <loc>${process.env.BASE_URL}/${category === 'users' ? 'authors' : category}/${
                            result.id
                        }</loc>
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
                Key: `${category}/${sitemapCount}.xml`,
                ContentType: 'text/xml',
                Body: sitemap
            })
        );
        queryResults =
            category === 'publications'
                ? await client.prisma.publication.findMany({
                      skip: 1,
                      cursor: {
                          id: queryResults[queryResults.length - 1].id
                      },
                      ...(queryOptions )
                  })
                : await client.prisma.user.findMany({
                      skip: 1,
                      cursor: {
                          id: queryResults[queryResults.length - 1].id
                      },
                      ...(queryOptions as Prisma.UserFindManyArgs)
                  });
    }

    // In case fewer sitemaps were generated than existed previously, clean up the old ones.
    // This should generally only occur locally.
    const bucketFiles = await listSitemapBucket();

    if (bucketFiles.Contents) {
        const s3KeyPrefix = category + '/';
        const applicableSitemapsInBucket = bucketFiles.Contents.filter(
            (file) => file.Key?.slice(0, s3KeyPrefix.length) === s3KeyPrefix
        );

        if (applicableSitemapsInBucket.length > sitemapCount) {
            for (const file of applicableSitemapsInBucket) {
                const fileNumber = Number(file.Key?.slice(s3KeyPrefix.length, -4));

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
};

export const getPaths = async (): Promise<string[]> => {
    const bucketFiles = await listSitemapBucket();

    if (bucketFiles.Contents) {
        return bucketFiles.Contents.flatMap((file) => file.Key || []);
    }

    return [];
};
