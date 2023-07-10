import * as helpers from 'lib/helpers';
import * as I from 'interface';

const createTopicSchema: I.Schema = {
    type: 'object',
    properties: {
        title: {
            type: 'string'
        },
        language: {
            type: 'string',
            enum: helpers.octopusInformation.languages
        },
        translations: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    language: {
                        type: 'string',
                        enum: helpers.octopusInformation.languages
                    },
                    value: {
                        type: 'string'
                    }
                },
                required: ['language', 'value']
            }
        },
        parentId: {
            type: 'string'
        }
    },
    required: ['title', 'parentId']
};

export default createTopicSchema;
