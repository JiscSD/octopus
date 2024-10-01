import * as I from 'interface';

const incrementalAriIngestHttpSchema: I.Schema = {
    type: 'object',
    properties: {
        apiKey: {
            type: 'string'
        },
        dryRun: {
            type: 'boolean'
        }
    },
    additionalProperties: false,
    required: ['apiKey']
};

export default incrementalAriIngestHttpSchema;
