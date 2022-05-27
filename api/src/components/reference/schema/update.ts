import * as I from 'interface';

const update: I.Schema = {
    type: 'object',
    properties: {
        type: {
            type: 'string',
            enum: <I.ReferenceType[]>['DOI', 'URL']
        },
        text: {
            type: 'string'
        }
    },
    required: ['type', 'text'],
    additionalProperties: false
};

export default update;
