import * as I from 'interface';

const markForDeletion: I.JSONSchemaType<I.MarkLinkForDeletionBody> = {
    type: 'object',
    properties: {
        toDelete: {
            type: 'boolean'
        }
    },
    required: ['toDelete'],
    additionalProperties: false
};

export default markForDeletion;
