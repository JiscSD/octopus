import * as I from 'interface';

const getUserFlagsSchema: I.JSONSchemaType<I.GetUserFlagsQueryParams> = {
    type: 'object',
    properties: {
        offset: {
            type: 'number',
            minimum: 0,
            default: 0
        },
        limit: {
            type: 'number',
            minimum: 1,
            default: 10
        },
        includeResolved: {
            type: 'boolean',
            default: false,
            nullable: true
        }
    },
    additionalProperties: false,
    required: []
};

export default getUserFlagsSchema;
