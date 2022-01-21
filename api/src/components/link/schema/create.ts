import * as I from 'interface';

const createPublicationSchema: I.Schema = {
    type: 'object',
    properties: {
        from: {
            type: 'string',
        },
        to: {
            type: 'string'
        }
    },
    required: ['from', 'to'],
    additionalProperties: false
};

export default createPublicationSchema;