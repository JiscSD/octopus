import * as I from 'interface';

const getAllSchema: I.Schema = {
    type: 'object',
    properties: {
        type: {
            type: 'string',
            pattern:
                '^((PROBLEM|PROTOCOL|ANALYSIS|REAL_WORLD_APPLICATION|HYPOTHESIS|DATA|INTERPRETATION|PEER_REVIEW)(,)?)+$',
            default: 'PROBLEM,PROTOCOL,ANALYSIS,REAL_WORLD_APPLICATION,HYPOTHESIS,DATA,INTERPRETATION,PEER_REVIEW'
        },
        limit: {
            type: 'number',
            default: 10
        },
        offset: {
            type: 'number',
            default: 0
        },
        search: {
            type: 'string'
        },
        exclude: {
            type: 'string'
        }
    },
    additionalProperties: false
};

export default getAllSchema;
