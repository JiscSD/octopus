import * as I from 'interface';
import * as H from 'lib/helpers';

const updatePublicationSchema: I.Schema = {
    type: 'object',
    properties: {
        title: {
            type: 'string'
        },
        licence: {
            type: 'string',
            enum: <I.LicenceType[]>['CC_BY', 'CC_BY_SA', 'CC_BY_ND', 'CC_BY_NC', 'CC_BY_NC_SA', 'CC_BY_NC_ND']
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
            enum: H.OctopusInformation.languages
        },
        ethicalStatement: {
            type: 'boolean'
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

export default updatePublicationSchema;
