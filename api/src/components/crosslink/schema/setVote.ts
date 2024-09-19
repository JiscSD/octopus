import * as I from 'interface';

const setVoteSchema: I.Schema = {
    type: 'object',
    properties: {
        vote: {
            type: 'boolean'
        }
    },
    required: ['vote'],
    additionalProperties: false
};

export default setVoteSchema;
