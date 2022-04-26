import ISO6391 from 'iso-639-1';

import * as I from 'interface';

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
            enum: ISO6391.getAllCodes(),
            maxLength: 2,
            minLength: 2
        }
    },
    additionalProperties: false
};

export default updatePublicationSchema;
