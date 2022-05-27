import * as I from 'interface';

const create: I.Schema = {
    type: 'object',
    properties: {
        publicationId: {
            type: 'string'
        },
        type: {
            type: 'string',
            enum: <I.ReferenceType[]>['DOI', 'URL']
        },
        text: {
            type: 'string'
        }
    },
    required: ['publicationId', 'type', 'text'],
    additionalProperties: false
};

export default create;
