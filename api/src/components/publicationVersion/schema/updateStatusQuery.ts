import * as I from 'interface';

const updateStatusQuerySchema: I.JSONSchemaType<I.UpdateStatusQueryParams> = {
    type: 'object',
    properties: {
        apiKey: {
            type: 'string'
        },
        ariContactConsent: {
            type: 'boolean',
            nullable: true
        }
    },
    additionalProperties: false
};

export default updateStatusQuerySchema;
