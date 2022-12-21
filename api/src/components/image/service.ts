import AWS from 'aws-sdk';

import * as client from 'lib/client';
import * as I from 'interface';

const config = {
    region: 'eu-west-1',
    endpoint: process.env.STAGE === 'local' ? `http://${process.env.LOCALSTACK_SERVER}:4566` : 'https://s3.eu-west-1.amazonaws.com',
    s3ForcePathStyle: true
};

if (process.env.STAGE === 'local') {
    // @ts-ignore
    config.credentials = {
        accessKeyId: 'dummy',
        secretAccessKey: 'dummy'
    };
}

const s3 = new AWS.S3(config);

export const createDBReference = async (name: string, extension: I.ImageExtension, user: string) => {
    const imageReference = await client.prisma.images.create({
        data: {
            name,
            extension,
            user
        }
    });

    return imageReference;
};

export const uploadToS3 = async (id: string, image: string, imageType: I.ImageExtension) => {
    const s3Image = await s3
        .putObject({
            Bucket: `science-octopus-publishing-images-${process.env.STAGE}`,
            Key: id,
            ContentType: `image/${imageType}`,
            ContentEncoding: 'base64',
            Body: Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64')
        })
        .promise();

    return s3Image;
};

export const get = async (id: string) => {
    const image = await client.prisma.images.findFirst({
        where: {
            id
        }
    });

    return image;
};

export const destroy = async (id: string) => {
    const image = await client.prisma.images.delete({
        where: {
            id
        }
    });

    return image;
};

export const getAll = async (user: string) => {
    const images = await client.prisma.images.findMany({
        where: {
            user
        }
    });

    return images;
};
