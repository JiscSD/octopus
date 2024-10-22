import * as config from 'config';
import * as Enum from 'enum';
import * as I from 'interface';

const createPublicationBodySchema: I.Schema = {
    type: 'object',
    properties: {
        type: {
            type: 'string',
            enum: <I.PublicationType[]>[
                'PROBLEM',
                'PROTOCOL',
                'ANALYSIS',
                'REAL_WORLD_APPLICATION',
                'HYPOTHESIS',
                'DATA',
                'INTERPRETATION',
                'PEER_REVIEW'
            ]
        },
        title: {
            type: 'string',
            minLength: 1
        },
        licence: {
            type: 'string',
            enum: <I.LicenceType[]>['CC_BY', 'CC_BY_SA', 'CC_BY_NC', 'CC_BY_NC_SA']
        },
        content: {
            type: 'string'
        },
        description: {
            type: 'string',
            maxLength: config.constants.publication.description.maxLength
        },
        keywords: {
            type: 'array',
            items: { type: 'string' },
            maxItems: 50 // TODO: Look at this
        },
        conflictOfInterestStatus: {
            type: 'boolean'
        },
        conflictOfInterestText: {
            type: 'string'
        },
        language: {
            type: 'string',
            enum: Enum.languageCodes
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
        },
        topicIds: {
            type: 'array',
            items: { type: 'string' }
        },
        linkedPublicationIds: {
            type: 'array',
            items: { type: 'string' }
        },
        externalId: {
            type: 'string'
        },
        externalSource: {
            type: 'string',
            enum: <I.PublicationImportSource[]>['ARI']
        }
    },
    required: ['type', 'title'],
    additionalProperties: false
};

export default createPublicationBodySchema;
