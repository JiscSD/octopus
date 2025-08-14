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
        }
    },
    required: ['enableBookmarkNotifications', 'enableBookmarkVersionNotifications', 'enableBookmarkFlagNotifications']
};

export default updateSettingsSchema;
