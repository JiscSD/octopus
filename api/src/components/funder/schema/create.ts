const createFunderSchema = {
    type: 'object',
    properties: {
        name: {
            type: 'string'
        },
        country: {
            type: 'string'
        },
        city: {
            type: 'string'
        },
        link: {
            type: 'string'
        },
        ror: {
            type: 'string'
        }
    },
    required: ['name', 'country', 'city', 'link'],
    additionalProperties: false
};

export default createFunderSchema;
