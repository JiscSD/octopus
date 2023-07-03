import * as client from 'lib/client';
import * as I from 'interface';
import * as s3 from 'lib/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';

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
    const s3Image = await s3.client.send(
        new PutObjectCommand({
            Bucket: `science-octopus-publishing-images-${process.env.STAGE}`,
            Key: id,
            ContentType: `image/${imageType}`,
            ContentEncoding: 'base64',
            Body: Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64')
        })
    );

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
