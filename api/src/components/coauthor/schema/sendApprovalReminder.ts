import * as I from 'interface';

const sendApprovalReminder: I.JSONSchemaType<I.SendApprovalReminderPathParams> = {
    type: 'object',
    properties: {
        coauthor: {
            type: 'string'
        },
        id: {
            type: 'string'
        }
    },
    required: ['coauthor', 'id']
};

export default sendApprovalReminder;
