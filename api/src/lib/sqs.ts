import AWS_SQS, { SQS } from '@aws-sdk/client-sqs';
import * as Helpers from './helpers';

const queueUrl = Helpers.checkEnvVariable('QUEUE_URL');
const endpoint = Helpers.checkEnvVariable('SQS_ENDPOINT');

const config = {
    region: 'eu-west-1',
    ...(process.env.STAGE === 'local'
        ? {
              credentials: {
                  accessKeyId: 'dummy',
                  secretAccessKey: 'dummy'
              },
              endpoint
          }
        : {})
};

const sqs = new SQS(config);

export const createQueue = async (): Promise<AWS_SQS.CreateQueueResult> => {
    // create SQS locally for PDF message queue
    return sqs.createQueue({
        QueueName: `pdf-generation-queue-${process.env.STAGE}-octopus`,
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
