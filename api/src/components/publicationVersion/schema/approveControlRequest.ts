import * as I from 'interface';

const approveControlRequest: I.JSONSchemaType<I.ApproveControlRequestBody> = {
    type: 'object',
    properties: {
        approve: {
            type: 'string',
            enum: ['true', 'false']
        },
        eventId: {
            type: 'string'
        }
    },
    required: ['approve', 'eventId'],
    additionalProperties: false
};

export default approveControlRequest;
