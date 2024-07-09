import * as I from 'interface';

const createPublicationQueryStringParametersSchema: I.Schema = {
    type: 'object',
    properties: {
        directPublish: {
            type: 'boolean'
        },
        apiKey: {
            type: 'string'
        }
    },
    additionalProperties: false
};

export default createPublicationQueryStringParametersSchema;
