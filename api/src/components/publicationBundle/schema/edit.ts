import * as I from 'interface';
import createSchema from './create';

const editPublicationBundleBody: I.JSONSchemaType<I.EditPublicationBundleRequestBody> = {
    ...createSchema,
    properties: {
        name: {
            ...createSchema.properties.name,
            nullable: true
        },
        publicationIds: {
            ...createSchema.properties.publicationIds,
            nullable: true
        }
    },
    required: []
};

export default editPublicationBundleBody;
