import * as I from 'interface';

const updateStatusSchema: I.Schema = {
    type: 'object',
    properties: {
        status: {
            type: 'string',
            enum: <I.PublicationStatusEnum[]>['LIVE', 'DRAFT', 'LOCKED']
        },
        id: {
            type: 'string'
        }
    },
    required: ['status', 'id'],
    additionalProperties: false
};

export default updateStatusSchema;
