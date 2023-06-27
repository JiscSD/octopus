import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';

const config: S3ClientConfig = {
    region: 'eu-west-1',
    endpoint: process.env.STAGE === 'local' ? process.env.LOCALSTACK_SERVER : 'https://s3.eu-west-1.amazonaws.com',
    forcePathStyle: true
};

if (process.env.STAGE === 'local') {
    // @ts-ignore
    config.credentials = {
        accessKeyId: 'dummy',
        secretAccessKey: 'dummy'
    };
}

export default new S3Client(config);
