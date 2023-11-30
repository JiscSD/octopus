import * as I from 'interface';

const updateAll: I.Schema = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            id: {
                type: 'string'
            },
            publicationVersionId: {
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
        required: ['type', 'text', 'id', 'publicationVersionId'],
        additionalProperties: false
    }
};

export default updateAll;
