import * as I from 'interface';

const getAllBookmarksSchema: I.JSONSchemaType<{ type: I.BookmarkType; entityId: string; apiKey: string }> = {
    type: 'object',
    properties: {
        type: {
            type: 'string',
            enum: <I.BookmarkType[]>['PUBLICATION', 'TOPIC']
        },
        entityId: {
            type: 'string'
        },
        apiKey: {
            type: 'string'
        }
    },
    required: ['type'],
    additionalProperties: false
};

export default getAllBookmarksSchema;
