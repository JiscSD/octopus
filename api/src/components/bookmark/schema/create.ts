import * as I from 'interface';

const createBookmarkSchema: I.Schema = {
    type: 'object',
    properties: {
        type: {
            type: 'string',
            enum: <I.BookmarkType[]>['PUBLICATION', 'TOPIC']
        },
        entityId: {
            type: 'string'
        }
    },
    required: ['type', 'entityId'],
    additionalProperties: false
};

export default createBookmarkSchema;
