import * as I from 'interface';
import * as H from 'lib/helpers';

const createPublicationSchema: I.Schema = {
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
            maxLength: 160 // TODO: Re look at this cap
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
            enum: H.OctopusInformation.languages
        },
        ethicalStatement: {
            type: 'boolean'
        },
        ethicalStatementFreeText: {
            type: 'string',
            maxLength: 255
        },
        dataPermissionsStatement: {
            type: 'string',
            maxLength: 255
        },
        dataAccessStatement: {
            type: 'string',
            maxLength: 255
        },
        selfDeclaration: {
            type: 'boolean'
        }
    },
    required: ['type', 'title'],
    additionalProperties: false
};

export default createPublicationSchema;
