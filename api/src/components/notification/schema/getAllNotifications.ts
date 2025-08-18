import * as I from 'interface';

const getAllNotifications: I.JSONSchemaType<I.TriggerNotificationsQueryParams> = {
    type: 'object',
    properties: {
        apiKey: {
            type: 'string'
        },
        force: {
            type: 'boolean',
            nullable: true
        }
    },
    additionalProperties: false,
    required: ['apiKey']
};

export default getAllNotifications;
