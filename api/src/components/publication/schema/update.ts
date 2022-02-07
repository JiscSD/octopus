import * as I from 'interface';

const updatePublicationSchema: I.Schema = {
    type: 'object',
    properties: {
        title: {
            type: 'string'
        },
        content: {
            type: 'string'
        },
        id: {
            type: 'string'
        }
    },
    additionalProperties: false
};

export default updatePublicationSchema;
