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

export interface User {
    id: string;
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

export interface AuthenticatedAPIRequest<
    BodyOverride = string | undefined,
    QueryStringParametersOverride = APIGatewayProxyEventQueryStringParameters | undefined,
    PathParamsOverride = APIGatewayProxyEventPathParameters | undefined
> extends Omit<APIGatewayProxyEventV2, 'body' | 'queryStringParameters' | 'pathParameters'> {
    body: BodyOverride;
    queryStringParameters: QueryStringParametersOverride;
    pathParameters: PathParamsOverride;
    user: User;
}

export type PublicationType = 'PROBLEM' | 'PROTOCOL' | 'ANALYSIS' | 'REAL_WORLD_APPLICATION' | 'HYPOTHESIS' | 'DATA' | 'INTERPRETATION' | 'PEER_REVIEW';

export interface CreatePublicationRequestBody {
    type: PublicationType;
    title: string;
    content?: string;
}

export interface GetPublicationPathParams {
    id: string;
}

export interface UpdateStatusPathParams {
    id: string;
    status: 'LIVE'
}

export interface CreateLinkBody {
    to: string;
    from: string;
}

export type PublicationStatus = 'DRAFT' | 'LIVE' | 'HIDDEN';
export type PublicationOrderBy = 'id' | 'createdAt' | 'updatedAt' | 'title';
export type UserOrderBy = 'id' | 'firstName' | 'lastName' | 'createdAt' | 'updatedAt';
export type OrderDirection = 'asc' | 'desc';

export interface PublicationFilters {
    search?: string;
    limit?: string;
    offset?: string;
    orderBy?: PublicationOrderBy;
    orderDirection?: OrderDirection;
    type: string;
};

export interface UserFilters {
    search?: string;
    limit?: string;
    offset?: string;
    orderBy?: UserOrderBy;
    orderDirection?: OrderDirection;
};

export type ProblemTypes = ['PROBLEM', 'PROTOCOL', 'ANALYSIS', 'REAL_WORLD_APPLICATION', 'HYPOTHESIS', 'DATA', 'INTERPRETATION', 'PEER_REVIEW'];
