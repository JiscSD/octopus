import { PrismaClient } from '@prisma/client';
import { Client } from '@opensearch-project/opensearch';

export const prisma = new PrismaClient();

// TODO: stage isn't available here, used an env & it worked, but
// 'stage' set in package.json is only showing on endpoint hit
const elasticSearchNode =
    process.env.STAGE === 'local'
        ? 'http://admin:admin@localhost:9200'
        : `https://${process.env.ELASTICSEARCH_USER}:${process.env.ELASTICSEARCH_PASSWORD}@${process.env.ELASTICSEARCH_ENDPOINT}`;

export const search = new Client({
    node: elasticSearchNode
});

// console.log(process.env);
