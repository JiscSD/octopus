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
        query: {
            type: 'string',
            nullable: true
        },
        versionStatus: {
            type: 'string',
            nullable: true
        }
    },
    required: []
};

export default getPublicationsSchema;
