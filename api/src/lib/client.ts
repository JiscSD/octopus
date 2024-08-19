import { PrismaClient } from '@prisma/client';
import { Client } from '@opensearch-project/opensearch';

export const prisma = new PrismaClient().$extends({
    query: {
        topicMapping: {
            // Ensure all topic mapping titles are saved in lower case.
            async create({ args, query }) {
                args.data = { ...args.data, title: args.data.title.toLowerCase() };

                return query(args);
            },
            async createMany({ args, query }) {
                if (Array.isArray(args.data)) {
                    args.data = args.data.map((item) => ({ ...item, title: item.title.toLowerCase() }));

                    return query(args);
                } else {
                    args.data = { ...args.data, title: args.data.title.toLowerCase() };

                    return query(args);
                }
            },
            async update({ args, query }) {
                if (typeof args.data.title === 'string') {
                    args.data = { ...args.data, title: args.data.title.toLowerCase() };
                }

                return query(args);
            },
            async updateMany({ args, query }) {
                if (Array.isArray(args.data)) {
                    args.data = args.data.map((item) => {
                        if (typeof item.title === 'string') {
                            return { ...item, title: item.title.toLowerCase() };
                        } else {
                            return item;
                        }
                    });

                    return query(args);
                } else {
                    if (typeof args.data.title === 'string') {
                        args.data = { ...args.data, title: args.data.title.toLowerCase() };
                    }

                    return query(args);
                }
            }
        },
        userMapping: {
            // Likewise, user mapping values are saved in lower case.
            async create({ args, query }) {
                args.data = { ...args.data, value: args.data.value.toLowerCase() };

                return query(args);
            },
            async createMany({ args, query }) {
                if (Array.isArray(args.data)) {
                    args.data = args.data.map((item) => ({ ...item, value: item.value.toLowerCase() }));

                    return query(args);
                } else {
                    args.data = { ...args.data, value: args.data.value.toLowerCase() };

                    return query(args);
                }
            },
            async update({ args, query }) {
                if (typeof args.data.value === 'string') {
                    args.data = { ...args.data, value: args.data.value.toLowerCase() };
                }

                return query(args);
            },
            async updateMany({ args, query }) {
                if (Array.isArray(args.data)) {
                    args.data = args.data.map((item) => {
                        if (typeof item.value === 'string') {
                            return { ...item, value: item.value.toLowerCase() };
                        } else {
                            return item;
                        }
                    });

                    return query(args);
                } else {
                    if (typeof args.data.value === 'string') {
                        args.data = { ...args.data, value: args.data.value.toLowerCase() };
                    }

                    return query(args);
                }
            }
        }
    }
});

const elasticSearchNode = `${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_USER}:${process.env.ELASTICSEARCH_PASSWORD}@${process.env.ELASTICSEARCH_ENDPOINT}`;

export const search = new Client({
    node: elasticSearchNode
});
