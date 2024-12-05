import * as I from 'interface';

const getAllSchema: I.Schema = {
    type: 'object',
    properties: {
        limit: {
            type: 'number',
            default: 10
        },
        offset: {
            type: 'number',
            default: 0
        },
        orderBy: {
            type: 'string',
            enum: ['id', 'createdAt', 'updatedAt', 'firstName', 'lastName'],
            default: 'updatedAt'
        },
        orderDirection: {
            type: 'string',
            enum: ['asc', 'desc'],
            default: 'desc'
        },
        role: {
            type: 'string',
            enum: ['USER', 'ORGANISATION']
        },
        search: {
            type: 'string',
            default: ''
        }
    },
    additionalProperties: false
};

export default getAllSchema;
