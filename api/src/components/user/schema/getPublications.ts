import * as I from 'interface';

const getPublicationsSchema: I.JSONSchemaType<I.UserPublicationsFilters> = {
    type: 'object',
    properties: {
        offset: {
            type: 'number',
            minimum: 0,
            default: 0
        },
        limit: {
            type: 'number',
            minimum: 1,
            default: 10
        },
        orderBy: {
            type: 'string',
            enum: ['id', 'title', 'createdAt', 'updatedAt', 'publishedDate', 'type'],
            nullable: true
        },
        orderDirection: {
            type: 'string',
            enum: ['asc', 'desc'],
            nullable: true
        }
    },
    required: []
};

export default getPublicationsSchema;
