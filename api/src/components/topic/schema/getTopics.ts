import * as I from 'interface';

const getTopicsSchema: I.JSONSchemaType<I.TopicsFilters> = {
    type: 'object',
    properties: {
        limit: {
            type: 'number',
            nullable: true,
            default: 10
        },
        offset: {
            type: 'number',
            nullable: true,
            default: 0
        },
        search: {
            type: 'string',
            nullable: true,
            default: ''
        },
        exclude: {
            type: 'string',
            nullable: true,
            default: ''
        }
    }
};

export default getTopicsSchema;
