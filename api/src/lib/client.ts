import { PrismaClient } from '@prisma/client';
import { Client } from '@opensearch-project/opensearch';

export const prisma = new PrismaClient().$extends({
    query: {
        topicMapping: {
            async create({ args, query }) {
                // Ensure all topic mapping titles are saved in lower case.
                args.data = { ...args.data, title: args.data.title.toLowerCase() };

                return query(args);
            }
        }
    }
});

const elasticSearchNode = `${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_USER}:${process.env.ELASTICSEARCH_PASSWORD}@${process.env.ELASTICSEARCH_ENDPOINT}`;

export const search = new Client({
    node: elasticSearchNode
});
