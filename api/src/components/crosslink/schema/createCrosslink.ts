import * as I from 'interface';

const createCrosslinkSchema: I.Schema = {
    type: 'object',
    properties: {
        publications: {
            type: 'array',
            items: {
                type: 'string'
            },
            maxItems: 2,
            minItems: 2,
            uniqueItems: true
        }
    },
    required: ['publications'],
    additionalProperties: false
};

export default createCrosslinkSchema;
