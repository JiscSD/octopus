import * as I from 'interface';

const createPublicationBundleBody: I.JSONSchemaType<I.CreatePublicationBundleRequestBody> = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            minLength: 1
        },
        publicationIds: {
            type: 'array',
            items: { type: 'string' },
            minItems: 2,
            maxItems: 30
        }
    },
    required: ['name', 'publicationIds'],
    additionalProperties: false
};

export default createPublicationBundleBody;
