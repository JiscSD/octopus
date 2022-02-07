import * as I from 'interface';

const updatedPublicationSchema: I.Schema = {
    type: 'object',
    properties: {
        status: {
            type: 'string',
            enum: ['LIVE']
        },
        id: {
            type: 'string'
        }
    },
    required: ['status', 'id'],
    additionalProperties: false
};

export default updatedPublicationSchema;
