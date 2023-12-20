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

export const buckets = {
    images: `science-octopus-publishing-images-${process.env.STAGE}`,
    pdfs: `science-octopus-publishing-pdfs-${process.env.STAGE}`,
    sitemaps: `science-octopus-publishing-sitemaps-${process.env.STAGE}`
};

export const client = new S3Client(config);
