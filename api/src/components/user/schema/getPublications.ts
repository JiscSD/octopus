import * as Enum from 'enum';
import * as I from 'interface';

const getPublicationsSchema: I.JSONSchemaType<I.UserPublicationsFilters> = {
    type: 'object',
    properties: {
        offset: {
            type: 'number',
            minimum: 0,
            default: 0
        },
        limit: {
            type: 'number',
            minimum: 1,
            default: 10
        },
        query: {
            type: 'string',
            nullable: true
        },
        versionStatus: {
            type: 'string',
            nullable: true
        },
        initialDraftsOnly: {
            type: 'boolean',
            default: false,
            nullable: true
        },
        exclude: {
            type: 'string',
            nullable: true
        },
        type: {
            type: 'string',
            pattern: `^((${Enum.publicationTypes.join('|')})(,)?)+$`,
            nullable: true
        }
    },
    required: []
};

export default getPublicationsSchema;
