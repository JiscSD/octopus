import * as I from 'interface';

const getUserFlagsSchema: I.JSONSchemaType<I.GetUserFlagsQueryParams> = {
    type: 'object',
    properties: {
        includeResolved: {
            type: 'boolean',
            default: false,
            nullable: true
        }
    },
    additionalProperties: false
};

export default getUserFlagsSchema;
