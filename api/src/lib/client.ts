import { PrismaClient } from '@prisma/client';
import { Client } from '@opensearch-project/opensearch';

export const prisma = new PrismaClient();

export const search = new Client({
    node: 'http://admin:admin@localhost:9200'
});
