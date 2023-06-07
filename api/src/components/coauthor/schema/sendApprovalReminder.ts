import * as I from 'interface';

const sendApprovalReminder: I.JSONSchemaType<I.SendApprovalReminderPathParams> = {
    type: 'object',
    properties: {
        coAuthor: {
            type: 'string'
        },
        id: {
            type: 'string'
        }
    },
    required: ['coAuthor', 'id']
};

export default sendApprovalReminder;
