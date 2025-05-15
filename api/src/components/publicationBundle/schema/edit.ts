import * as I from 'interface';

const editPublicationBundleBody: I.JSONSchemaType<I.EditPublicationBundleRequestBody> = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            minLength: 1,
            nullable: true
        },
        publicationIds: {
            type: 'array',
            items: { type: 'string' },
            minItems: 2,
            maxItems: 30,
            nullable: true
        }
    },
    required: [],
    additionalProperties: false
};

export default editPublicationBundleBody;
