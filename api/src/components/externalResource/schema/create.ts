import * as I from 'interface';

const createExternalResourceSchema: I.JSONSchemaType<I.CreateExternalResourceBody> = {
    type: 'object',
    properties: {
        title: {
            type: 'string'
        },
        url: {
            type: 'string'
        },
        description: {
            type: 'string',
            nullable: true,
            maxLength: 255
        }
    },
    required: ['title', 'url'],
    additionalProperties: false
};

export default createExternalResourceSchema;
