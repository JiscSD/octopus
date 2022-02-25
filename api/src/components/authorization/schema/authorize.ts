import * as I from 'interface';

const authorizeSchema: I.Schema = {
    type: 'object',
    properties: {
        code: {
            type: 'string'
        }
    },
    required: ['code'],
    additionalProperties: false
};

export default authorizeSchema;
