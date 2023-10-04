import * as I from 'interface';

const updatePublicationSchema: I.JSONSchemaType<I.UpdatePublicationRequestBody> = {
    type: 'object',
    properties: {
        topics: {
            type: 'array',
            items: {
                type: 'string'
            },
            nullable: true
        }
    },
    additionalProperties: false
};

export default updatePublicationSchema;
