import { PrismaClient } from '@prisma/client';
import { Client } from '@opensearch-project/opensearch';

export const prisma = new PrismaClient();

const elasticSearchNode = `${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_USER}:${process.env.ELASTICSEARCH_PASSWORD}@${process.env.ELASTICSEARCH_ENDPOINT}`;

export const search = new Client({
    node: elasticSearchNode
});
