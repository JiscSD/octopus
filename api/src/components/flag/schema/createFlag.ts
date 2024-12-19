import * as I from 'interface';

const updatedPublicationSchema: I.Schema = {
    type: 'object',
    properties: {
        category: {
            type: 'string',
            enum: <I.PublicationFlagCategoryEnum[]>[
                'PLAGIARISM',
                'ETHICAL_ISSUES',
                'MISREPRESENTATION',
                'UNDECLARED_IMAGE_MANIPULATION',
                'COPYRIGHT',
                'INAPPROPRIATE',
                'UNDECLARED_AI',
                'NOT_IN_OCTOPUS_FORMAT',
                'IRRELEVANT_LINKED_PUBLICATION'
            ]
        },
        comment: {
            type: 'string'
        }
    },
    required: ['comment', 'category'],
    additionalProperties: false
};

export default updatedPublicationSchema;
