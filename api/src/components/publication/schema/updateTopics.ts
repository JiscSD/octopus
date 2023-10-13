import * as I from 'interface';

const updateTopicsSchema: I.Schema = {
    type: 'object',
    properties: {
        topics: {
            type: 'array',
            items: {
                type: 'string'
            }
        }
    },
    required: ['topics'],
    additionalProperties: false
};

export default updateTopicsSchema;
