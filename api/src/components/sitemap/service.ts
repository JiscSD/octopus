import * as client from 'lib/client';
import * as s3 from 'lib/s3';
import { ListObjectsCommand, PutObjectCommand } from '@aws-sdk/client-s3';

export const generatePublicationSitemaps = async () => {
    const allPublicationIdsResults = await client.prisma.publication.findMany({
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
    });

    const now = new Date().toISOString();
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${allPublicationIdsResults
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

    const s3Put = await s3.client.send(
        new PutObjectCommand({
            Bucket: s3.buckets.sitemaps,
            Key: '1.xml',
            ContentType: 'text/xml',
            Body: sitemap
        })
    );

    return s3Put;
};

export const getUrls = async (): Promise<string[]> => {
    const listBucketObjects = await s3.client.send(
        new ListObjectsCommand({
            Bucket: s3.buckets.sitemaps
        })
    );

    if (listBucketObjects.Contents) {
        return listBucketObjects.Contents.map(
            (bucketObject) => `${s3.endpoint}/${s3.buckets.sitemaps}/${bucketObject.Key}`
        );
    }

    return [];
};
