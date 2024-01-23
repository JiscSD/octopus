import * as I from 'interface';

const getPDF: I.JSONSchemaType<I.GeneratePDFPathParams> = {
    type: 'object',
    properties: {
        publicationId: {
            type: 'string'
        }
    },
    required: ['publicationId'],
    additionalProperties: false
};

export default getPDF;
