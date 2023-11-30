import * as I from 'interface';

const updateStatusSchema: I.JSONSchemaType<I.UpdateStatusPathParams> = {
    type: 'object',
    properties: {
        status: {
            type: 'string',
            enum: ['LIVE', 'DRAFT', 'LOCKED']
        },
        id: {
            type: 'string'
        }
    },
    required: ['status', 'id'],
    additionalProperties: false
};

export default updateStatusSchema;
