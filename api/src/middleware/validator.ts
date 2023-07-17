import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import middy from '@middy/core';

import * as I from 'interface';
import * as response from 'lib/response';

const validator = (schema: I.Schema, requestType: I.RequestType): middy.MiddlewareObj => {
    const before: middy.MiddlewareFn<I.APIGatewayProxyEventV2> = async (request): Promise<I.JSONResponse | void> => {
        const ajv = new Ajv({ allErrors: true, useDefaults: true, coerceTypes: true });

        addFormats(ajv);
        const validate = ajv.compile(schema);

        if (requestType === 'queryStringParameters' && !request.event[requestType]) {
            request.event[requestType] = {};
        }

        const valid = validate(request.event[requestType] || {});

        if (!valid) {
            return response.json(422, { message: validate.errors });
        }
    };

    return {
        before
    };
};

export default validator;
