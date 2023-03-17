import AWS from 'aws-sdk';

const config = {
    region: 'eu-west-1',
    endpoint: process.env.STAGE === 'local' ? process.env.LOCALSTACK_SERVER : 'https://s3.eu-west-1.amazonaws.com',
    s3ForcePathStyle: true
};

if (process.env.STAGE === 'local') {
    // @ts-ignore
    config.credentials = {
        accessKeyId: 'dummy',
        secretAccessKey: 'dummy'
    };
}

export default new AWS.S3(config);
