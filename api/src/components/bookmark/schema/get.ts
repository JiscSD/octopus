import * as I from 'interface';

const getBookmarkSchema: I.Schema = {
    type: 'object',
    properties: {
        type: {
            type: 'string',
            enum: <I.GetBookmarkPathParamType[]>['publication', 'topic']
        },
        entityId: {
            type: 'string'
        }
    },
    required: ['type', 'entityId'],
    additionalProperties: false
};

export default getBookmarkSchema;
