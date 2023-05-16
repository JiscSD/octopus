import AWS from 'aws-sdk';

const queueUrl =
    process.env.STAGE === 'local'
        ? 'http://localhost:4566/000000000000/science-octopus-pdf-queue-local'
        : `https://sqs.eu-west-1.amazonaws.com/948306873545/science-octopus-pdf-queue-${process.env.STAGE}`;

const config = {
    region: 'eu-west-1',
    endpoint: process.env.STAGE === 'local' ? process.env.LOCALSTACK_SERVER : 'https://sqs.eu-west-1.amazonaws.com'
};

if (process.env.STAGE === 'local') {
    // @ts-ignore
    config.credentials = {
        accessKeyId: 'dummy',
        secretAccessKey: 'dummy',
        sessionToken: 'dummy'
    };
}

const sqs = new AWS.SQS(config);

export const createQueue = async (): Promise<AWS.SQS.CreateQueueResult> => {
    // create SQS locally for PDF message queue
    return sqs
        .createQueue({
            QueueName: `science-octopus-pdf-queue-${process.env.STAGE}`,
            Attributes: {
                DelaySeconds: '60',
                MessageRetentionPeriod: '86400'
            }
        })
        .promise();
};

export const sendMessage = async (message: string): Promise<AWS.SQS.SendMessageResult> => {
    // send message to AWS SQS queue
    const params = {
        DelaySeconds: 10,
        MessageBody: message,
        QueueUrl: queueUrl
    };

    return sqs.sendMessage(params).promise();
};

export const getQueue = async (queueName: string): Promise<void> => {
    await sqs.getQueueUrl({ QueueName: queueName }).promise();
};
