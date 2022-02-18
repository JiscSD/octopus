import * as I from 'interface';

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
        conflictOfInterestStatus: {
            type: 'boolean'
        },
        conflictOfInterestSupportText: {
            type: 'string'
        },
        conflictOfInterestExplanatoryText: {
            type: 'string'
        }
    },
    required: ['type', 'title'],
    additionalProperties: false
};

export default createPublicationSchema;
