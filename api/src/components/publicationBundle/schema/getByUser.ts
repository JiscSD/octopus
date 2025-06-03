import * as I from 'interface';

const getPublicationsByUserIdQueryParams: I.JSONSchemaType<I.GetPublicationBundlesByUserQueryParams> = {
    type: 'object',
    properties: {
        apiKey: {
            type: 'string',
            nullable: true
        },
        limit: {
            type: 'integer',
            nullable: true,
            default: null
        },
        offset: {
            type: 'number',
            nullable: true,
            default: null
        }
    },
    required: [],
    additionalProperties: false
};

export default getPublicationsByUserIdQueryParams;
