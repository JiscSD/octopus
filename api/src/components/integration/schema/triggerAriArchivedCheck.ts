import * as I from 'interface';

const ariArchivedCheckHttpSchema: I.JSONSchemaType<I.TriggerAriArchivedCheckQueryParams> = {
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

export default ariArchivedCheckHttpSchema;
