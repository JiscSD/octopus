import * as I from 'interface';

const getPublicationCrosslinksSchema: I.JSONSchemaType<I.GetPublicationCrosslinksQueryParams> = {
    type: 'object',
    properties: {
        order: {
            type: 'string',
            enum: ['mix', 'relevant', null],
            nullable: true,
            default: null
        }
    }
};

export default getPublicationCrosslinksSchema;
