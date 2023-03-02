import * as I from 'interface';

const sendApprovalReminder: I.JSONSchemaType<I.SendApprovalReminderPathParams> = {
    type: 'object',
    properties: {
        authorId: {
            type: 'string'
        },
        publicationId: {
            type: 'string'
        }
    },
    required: ['authorId', 'publicationId']
};

export default sendApprovalReminder;
