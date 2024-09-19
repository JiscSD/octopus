import * as Enum from 'enum';
import * as I from 'interface';

const updatePublicationVersionSchema: I.JSONSchemaType<I.UpdatePublicationVersionRequestBody> = {
    type: 'object',
    properties: {
        title: {
            type: 'string',
            nullable: true
        },
        content: {
            type: 'string',
            nullable: true
        },
        description: {
            type: 'string',
            maxLength: 160,
            nullable: true
        },
        keywords: {
            type: 'array',
            items: { type: 'string' },
            maxItems: 10,
            nullable: true
        },
        conflictOfInterestStatus: {
            type: 'boolean',
            nullable: true
        },
        conflictOfInterestText: {
            type: 'string',
            nullable: true
        },
        language: {
            type: 'string',
            enum: Enum.languageCodes,
            nullable: true
        },
        ethicalStatement: {
            type: 'string',
            nullable: true
        },
        ethicalStatementFreeText: {
            type: 'string',
            nullable: true
        },
        dataPermissionsStatement: {
            type: 'string',
            nullable: true
        },
        dataPermissionsStatementProvidedBy: {
            type: 'string',
            nullable: true
        },
        dataAccessStatement: {
            type: 'string',
            nullable: true
        },
        selfDeclaration: {
            type: 'boolean',
            nullable: true
        },
        fundersStatement: {
            type: 'string',
            nullable: true
        },
        topics: {
            type: 'array',
            items: { type: 'string' },
            nullable: true
        }
    },
    additionalProperties: false
};

export default updatePublicationVersionSchema;
