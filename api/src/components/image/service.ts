import * as client from 'lib/client';
import * as I from 'interface';
import * as s3 from 'lib/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export const createDBReference = (name: string, extension: I.ImageExtension, user: string) =>
    client.prisma.images.create({
        data: {
            name,
            extension,
            user
        }
    });

export const uploadToS3 = (id: string, image: string, imageType: I.ImageExtension) =>
    s3.client.send(
        new PutObjectCommand({
            Bucket: s3.buckets.images,
            Key: id,
            ContentType: `image/${imageType}`,
            ContentEncoding: 'base64',
            Body: Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64')
        })
    );

export const get = (id: string) =>
    client.prisma.images.findFirst({
        where: {
            id
        }
    });

export const destroy = (id: string) =>
    client.prisma.images.delete({
        where: {
            id
        }
    });

export const getAll = (user: string) =>
    client.prisma.images.findMany({
        where: {
            user
        }
    });
