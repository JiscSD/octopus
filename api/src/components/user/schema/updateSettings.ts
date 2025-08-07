import * as I from 'interface';

const updateSettingsSchema: I.JSONSchemaType<I.User['settings']> = {
    type: 'object',
    properties: {
        enableBookmarkNotifications: {
            type: 'boolean'
        },
        enableBookmarkVersionNotifications: {
            type: 'boolean'
        },
        enableBookmarkFlagNotifications: {
            type: 'boolean'
        },
        enableVersionFlagNotifications: {
            type: 'boolean'
        },
        enablePeerReviewNotifications: {
            type: 'boolean'
        },
        enableLinkedNotifications: {
            type: 'boolean'
        }
    },
    required: [
        'enableBookmarkNotifications',
        'enableBookmarkVersionNotifications',
        'enableBookmarkFlagNotifications',
        'enableVersionFlagNotifications',
        'enablePeerReviewNotifications',
        'enableLinkedNotifications'
    ]
};

export default updateSettingsSchema;
