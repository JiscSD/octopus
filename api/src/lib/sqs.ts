import AWS from 'aws-sdk';

const queueUrl =
    process.env.STAGE === 'local'
        ? 'http://localhost:4566/000000000000/science-octopus-local-pdf-queue'
        : 'https://sqs.eu-west-1.amazonaws.com/some/queue';

const config = {
    region: 'eu-west-1',
    endpoint: process.env.STAGE === 'local' ? process.env.LOCALSTACK_SERVER : 'https://sqs.eu-west-1.amazonaws.com'
};

if (process.env.STAGE === 'local') {
    // @ts-ignore
    config.credentials = {
        accessKeyId: 'dummy',
        secretAccessKey: 'dummy'
    };
}

const sqs = new AWS.SQS(config);

export const createQueue = async (): Promise<void> => {
    // create SQS locally for PDF message queue
    await sqs
        .createQueue(
            {
                QueueName: 'science-octopus-local-pdf-queue',
                Attributes: {
                    DelaySeconds: '60',
                    MessageRetentionPeriod: '86400'
                }
            },
            function (err, data) {
                if (err) {
                    console.log('Error', err);
                } else {
                    console.log('Queue Created', data.QueueUrl);
                }
            }
        )
        .promise();
};

export const sendMessage = async (message: string): Promise<void> => {
    // send message to AWS SQS queue
    const params = {
        DelaySeconds: 10,
        MessageBody: message,
        QueueUrl: queueUrl
    };

    await sqs
        .sendMessage(params, function (err, data) {
            if (err) {
                console.log('Error', err);
            } else {
                console.log('Queue created:', data.MessageId);
            }
        })
        .promise();
};

export const getQueue = async (queueName: string): Promise<void> => {
    await sqs.getQueueUrl({ QueueName: queueName }).promise();
};
