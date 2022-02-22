import * as I from 'interface';

const updatedPublicationSchema: I.Schema = {
    type: 'object',
    properties: {
        status: {
            type: 'string',
            enum: <I.PublicationStatusEnum[]>['LIVE']
        },
        id: {
            type: 'string'
        }
    },
    required: ['status', 'id'],
    additionalProperties: false
};

export default updatedPublicationSchema;
