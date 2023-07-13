import AWS_SQS, { SQS } from '@aws-sdk/client-sqs';
import * as helpers from './helpers';

const queueUrl = helpers.checkEnvVariable('QUEUE_URL');
const endpoint = helpers.checkEnvVariable('SQS_ENDPOINT');

const config = {
    region: 'eu-west-1'
};

if (process.env.STAGE === 'local') {
    // @ts-ignore
    config.credentials = {
        accessKeyId: 'dummy',
        secretAccessKey: 'dummy'
    };

    // @ts-ignore
    config.endpoint = endpoint;
}

const sqs = new SQS(config);

export const createQueue = async (): Promise<AWS_SQS.CreateQueueResult> => {
    // create SQS locally for PDF message queue
    return sqs.createQueue({
        QueueName: `science-octopus-pdf-queue-${process.env.STAGE}`,
        Attributes: {
            DelaySeconds: '60',
            MessageRetentionPeriod: '86400'
        }
    });
};

export const sendMessage = async (message: string): Promise<AWS_SQS.SendMessageResult> => {
    // send message to AWS SQS queue
    const params = {
        DelaySeconds: 10,
        MessageBody: message,
        QueueUrl: queueUrl
    };

    return sqs.sendMessage(params);
};

export const getQueue = async (queueName: string): Promise<void> => {
    await sqs.getQueueUrl({ QueueName: queueName });
};
