import * as I from 'interface';

const createFlagCommentSchema: I.Schema = {
    type: 'object',
    properties: {
        comment: {
            type: 'string'
        }
    },
    required: ['comment'],
    additionalProperties: false
};

export default createFlagCommentSchema;
