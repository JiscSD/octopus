const linkCoAuthorSchema = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            format: 'email'
        },
        code: {
            type: 'string'
        },
        approve: {
            type: 'boolean'
        }
    },
    required: ['email', 'code', 'approve'],
    additionalProperties: false
};

export default linkCoAuthorSchema;
