import * as I from 'interface';

const getAllBookmarksSchema: I.JSONSchemaType<{ type: I.BookmarkType; apiKey: string }> = {
    type: 'object',
    properties: {
        type: {
            type: 'string',
            enum: <I.BookmarkType[]>['PUBLICATION', 'TOPIC']
        },
        apiKey: {
            type: 'string'
        }
    },
    required: ['apiKey'],
    additionalProperties: false
};

export default getAllBookmarksSchema;
