import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';

export const endpoint =
    process.env.STAGE === 'local' ? process.env.LOCALSTACK_SERVER : 'https://s3.eu-west-1.amazonaws.com';

const config: S3ClientConfig = {
    region: 'eu-west-1',
    endpoint,
    forcePathStyle: true
};

if (process.env.STAGE === 'local') {
    // @ts-ignore
    config.credentials = {
        accessKeyId: 'dummy',
        secretAccessKey: 'dummy'
    };
}

type OctopusBucketType = 'images' | 'pdfs' | 'sitemaps';
const buckets: {
    [key in OctopusBucketType]?: string;
} = {};

for (const nameSegment of ['images', 'pdfs', 'sitemaps']) {
    buckets[nameSegment] = `science-octopus-publishing-${nameSegment}-${process.env.STAGE}`;
}

export { buckets };

export const client = new S3Client(config);
