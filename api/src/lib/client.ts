import { PrismaClient } from '@prisma/client';
import { Client } from '@opensearch-project/opensearch';

export const prisma = new PrismaClient();

const elasticSearchNode =
    process.env.stage === 'local'
        ? 'http://admin:admin@localhost:9200'
        : `https://${process.env.ELASTICSEARCH_USER}:${process.env.ELASTICSEARCH_PASSWORD}@${process.env.ELASTICSEARCH_ENDPOINT}`;

export const search = new Client({
    node: elasticSearchNode
});
