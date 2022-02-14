import * as I from 'interface';

const updatedPublicationSchema: I.Schema = {
    type: 'object',
    properties: {
        category: {
            type: 'string',
            enum: [
                'PLAGARISM',
                'ETHICAL_ISSUES',
                'MISREPRESENTATION',
                'UNDECLARED_IMAGE_MANIPULATION',
                'COPYRIGHT',
                'INAPPROPRIATE'
            ]
        },
        comments: {
            type: 'string'
        }
    },
    required: ['comments', 'category'],
    additionalProperties: false
};

export default updatedPublicationSchema;
