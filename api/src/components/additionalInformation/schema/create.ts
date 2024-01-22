import * as I from 'interface';

const createAdditionalInformationSchema: I.JSONSchemaType<I.CreateAdditionalInformationBody> = {
    type: 'object',
    properties: {
        title: {
            type: 'string',
            minLength: 1
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

export default createAdditionalInformationSchema;
