import * as I from 'interface';

const create: I.Schema = {
    type: 'object',
    properties: {
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
