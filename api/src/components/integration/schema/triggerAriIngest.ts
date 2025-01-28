import * as I from 'interface';

const incrementalAriIngestHttpSchema: I.JSONSchemaType<I.TriggerAriIngestQueryParams> = {
    type: 'object',
    properties: {
        apiKey: {
            type: 'string'
        },
        dryRun: {
            type: 'boolean',
            nullable: true
        }
    },
    additionalProperties: false,
    required: ['apiKey']
};

export default incrementalAriIngestHttpSchema;
