import * as I from 'interface';

const sendApprovalReminder: I.JSONSchemaType<I.SendApprovalReminderPathParams> = {
    type: 'object',
    properties: {
        coauthorId: {
            type: 'string'
        },
        publicationVersionId: {
            type: 'string'
        }
    },
    required: ['coauthorId', 'publicationVersionId']
};

export default sendApprovalReminder;
