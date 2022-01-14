import { APIGatewayProxyEventV2, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyEventPathParameters } from 'aws-lambda';

export { APIGatewayProxyEventV2, APIGatewayProxyResultV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';
export { HandlerLambda } from 'middy';
export { Schema, JSONSchemaType } from 'ajv';

export type RequestType = 'body' | 'queryStringParameters' | 'pathParameters';

export interface JSONResponse {
    body: string;
    headers: any;
    statusCode: number;
}

export interface APIRequest<
    BodyOverride = string | undefined,
    QueryStringParametersOverride = APIGatewayProxyEventQueryStringParameters | undefined,
    PathParamsOverride = APIGatewayProxyEventPathParameters | undefined
> extends Omit<APIGatewayProxyEventV2, 'body' | 'queryStringParameters' | 'pathParameters'> {
    body: BodyOverride;
    queryStringParameters: QueryStringParametersOverride;
    pathParameters: PathParamsOverride;
}
