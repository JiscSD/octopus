import * as I from 'interface';
import * as H from 'lib/helpers';

const updatePublicationVersionSchema: I.Schema = {
    type: 'object',
    properties: {
        title: {
            type: 'string'
        },
        content: {
            type: 'string'
        },
        description: {
            type: 'string',
            maxLength: 160
        },
        keywords: {
            type: 'array',
            items: { type: 'string' },
            maxItems: 10
        },
        id: {
            type: 'string'
        },
        conflictOfInterestStatus: {
            type: 'boolean'
        },
        conflictOfInterestText: {
            type: 'string'
        },
        language: {
            type: 'string',
            enum: H.octopusInformation.languages
        },
        ethicalStatement: {
            type: 'string'
        },
        ethicalStatementFreeText: {
            type: 'string'
        },
        dataPermissionsStatement: {
            type: 'string'
        },
        dataPermissionsStatementProvidedBy: {
            type: 'string',
            nullable: true
        },
        dataAccessStatement: {
            type: 'string'
        },
        selfDeclaration: {
            type: 'boolean'
        },
        fundersStatement: {
            type: 'string'
        },
        affiliationStatement: {
            type: 'string'
        }
    },
    additionalProperties: false
};

export default updatePublicationVersionSchema;
