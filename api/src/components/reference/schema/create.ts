import * as I from 'interface';

const create: I.Schema = {
    type: 'object',
    properties: {
        id: {
            type: 'string'
        },
        type: {
            type: 'string',
            enum: <I.ReferenceType[]>['DOI', 'URL', 'TEXT']
        },
        text: {
            type: 'string'
        },
        location: {
            type: 'string'
        }
    },
    required: ['type', 'text'],
    additionalProperties: false
};

export default create;
