import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import * as Helpers from 'lib/helpers';

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

export const getPDFURL = (publicationId: string): string => {
    const objectKey = `${publicationId}.pdf`;

    return process.env.STAGE === 'local'
        ? Helpers.checkEnvVariable('LOCALSTACK_SERVER') + buckets.pdfs + `/${objectKey}`
        : `https://${buckets.pdfs}.s3.amazonaws.com/${objectKey}`;
};
