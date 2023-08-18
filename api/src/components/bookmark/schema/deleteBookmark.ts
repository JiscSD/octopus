import * as I from 'interface';

const deleteBookmarkSchema: I.Schema = {
    type: 'object',
    properties: {
        id: {
            type: 'string'
        }
    },
    required: ['id'],
    additionalProperties: false
};

export default deleteBookmarkSchema;
