const updateConfirmationSchema = {
    type: 'object',
    properties: {
        confirm: {
            type: 'boolean'
        },
        retainApproval: {
            type: 'boolean'
        }
    },
    required: ['confirm'],
    additionalProperties: false
};

export default updateConfirmationSchema;
