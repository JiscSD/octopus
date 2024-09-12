import * as I from 'interface';

const updateStatusPathSchema: I.JSONSchemaType<I.UpdateStatusPathParams> = {
    type: 'object',
    properties: {
        status: {
            type: 'string',
            enum: ['LIVE', 'DRAFT', 'LOCKED']
        },
        publicationVersionId: {
            type: 'string'
        }
    },
    required: ['status', 'publicationVersionId'],
    additionalProperties: false
};

export default updateStatusPathSchema;
