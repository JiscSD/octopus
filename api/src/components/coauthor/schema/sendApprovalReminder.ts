import * as I from 'interface';

const sendApprovalReminder: I.JSONSchemaType<I.SendApprovalReminderPathParams> = {
    type: 'object',
    properties: {
        coAuthorId: {
            type: 'string'
        },
        publicationVersionId: {
            type: 'string'
        }
    },
    required: ['coAuthorId', 'publicationVersionId']
};

export default sendApprovalReminder;
