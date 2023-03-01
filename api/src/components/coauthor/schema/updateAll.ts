import * as I from 'interface';

const updateAll: I.Schema = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            id: {
                type: 'string'
            },
            publicationId: {
                type: 'string'
            },
            email: {
                type: 'string'
            },
            code: {
                type: 'string'
            },
            confirmedCoAuthor: {
                type: 'boolean'
            },
            approvalRequested: {
                type: 'boolean'
            },
            linkedUser: {
                type: ['string', 'null']
            },
            createdAt: {
                type: 'string'
            },
            reminderDate: {
                type: ['string', 'null']
            },
            user: {
                type: ['object', 'null'],
                properties: {
                    firstName: {
                        type: 'string'
                    },
                    lastName: {
                        type: 'string'
                    },
                    orcid: {
                        type: 'string'
                    }
                }
            }
        },
        required: ['id', 'email'],
        additionalProperties: false
    }
};

export default updateAll;
