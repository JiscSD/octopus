import * as I from 'interface';

const getPDF: I.JSONSchemaType<I.GeneratePDFPathParams> = {
    type: 'object',
    properties: {
        id: {
            type: 'string'
        }
    },
    required: ['id'],
    additionalProperties: false
};

export default getPDF;
