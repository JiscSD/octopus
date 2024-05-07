import * as I from 'interface';

const getPublicationCrosslinksSchema: I.JSONSchemaType<I.GetPublicationCrosslinksQueryParams> = {
    type: 'object',
    properties: {
        search: {
            type: 'string',
            nullable: true,
            default: ''
        },
        offset: {
            type: 'number',
            nullable: true,
            default: 0
        },
        limit: {
            type: 'number',
            nullable: true,
            default: 10
        },
        own: {
            type: 'string',
            enum: ['true', 'false', null],
            nullable: true,
            default: null
        },
        order: {
            type: 'string',
            enum: ['mix', 'relevant', 'recent', null],
            nullable: true,
            default: null
        }
    }
};

export default getPublicationCrosslinksSchema;
