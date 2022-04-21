import * as I from 'interface';

const get: I.Schema = {
    type: 'object',
    properties: {
        user: {
            type: 'string'
        }
    },
    additionalProperties: false
};

export default get;
