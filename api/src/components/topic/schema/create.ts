import * as Enum from 'enum';
import * as I from 'interface';

const createTopicSchema: I.Schema = {
    type: 'object',
    properties: {
        title: {
            type: 'string'
        },
        language: {
            type: 'string',
            enum: Enum.languageCodes
        },
        translations: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    language: {
                        type: 'string',
                        enum: Enum.languageCodes
                    },
                    value: {
                        type: 'string'
                    }
                },
                required: ['language', 'value']
            }
        },
        parentIds: {
            type: 'array',
            items: { type: 'string' },
            minItems: 1
        }
    },
    required: ['title', 'parentIds']
};

export default createTopicSchema;
