import { Prisma, PublicationType, LicenceType, PublicationFlagCategoryEnum, Role } from '@prisma/client';
export { PublicationType, LicenceType, PublicationStatusEnum, PublicationFlagCategoryEnum, Role } from '@prisma/client';

import {
    APIGatewayProxyEventV2,
    APIGatewayProxyEventQueryStringParameters,
    APIGatewayProxyEventPathParameters
} from 'aws-lambda';

export { APIGatewayProxyEventV2, APIGatewayProxyResultV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';
export { HandlerLambda } from 'middy';
export { Schema, JSONSchemaType } from 'ajv';

export type RequestType = 'body' | 'queryStringParameters' | 'pathParameters';

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

export interface OptionalAuthenticatedAPIRequest<
    BodyOverride = string | undefined,
    QueryStringParametersOverride = APIGatewayProxyEventQueryStringParameters | undefined,
    PathParamsOverride = APIGatewayProxyEventPathParameters | undefined
> extends Omit<APIGatewayProxyEventV2, 'body' | 'queryStringParameters' | 'pathParameters'> {
    body: BodyOverride;
    queryStringParameters: QueryStringParametersOverride;
    pathParameters: PathParamsOverride;
    user?: User;
}

export interface JSONResponse {
    body: string;
    headers: any;
    statusCode: number;
}

/**
 * @description Publications
 */

const prismaGeneratedPublicationType = Prisma.validator<Prisma.PublicationArgs>()({});
export type Publication = Prisma.PublicationGetPayload<typeof prismaGeneratedPublicationType>;

export interface CreatePublicationRequestBody {
    type: PublicationType;
    title: string;
    licence?: LicenceType;
    description?: string;
    keywords?: string[];
    content?: string;
}

export interface GetPublicationPathParams {
    id: string;
}

export interface UpdatePublicationPathParams {
    id: string;
}

export interface UpdateStatusPathParams {
    id: string;
    status: 'LIVE';
}

export interface UpdatePublicationRequestBody {
    content?: string;
    title?: string;
    licence?: LicenceType;
    description?: string;
    keywords?: string[];
    id?: string;
}

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
}

/**
 * @description Links
 */
export interface CreateLinkBody {
    to: string;
    from: string;
}

/**
 * @description Users
 */
export interface User {
    id: string;
    email: string | null;
    createdAt: Date;
    firstName: string;
    lastName: string | null;
    locked: boolean;
    orcid: string;
    role: Role;
}

export interface UserFilters {
    search?: string;
    limit?: string;
    offset?: string;
    orderBy?: UserOrderBy;
    orderDirection?: OrderDirection;
}

export interface GetUserParameters {
    id: string;
}

/**
 * @description Flags
 */

export type FlagCategory =
    | 'PLAGIARISM'
    | 'ETHICAL_ISSUES'
    | 'MISREPRESENTATION'
    | 'UNDECLARED_IMAGE_MANIPULATION'
    | 'COPYRIGHT'
    | 'INAPPROPRIATE';

export interface CreateFlagPathParams {
    id: string;
}

export interface CreateFlagRequestBody {
    category: PublicationFlagCategoryEnum;
    comments: string;
}

export interface AuthorizeRequestBody {
    code: string;
}

export interface UpdateUserInformation {
    firstName: string;
    lastName: string;
}

export interface DeletePublicationPathParams {
    id: string;
}

export type ValidStatuses = 'DRAFT' | 'LIVE';
/**
 * ORCID
 */

type ORCIDName = {
    errors: string[];
    value: string;
    required: boolean;
    getRequiredMessage: null;
};

/**
 * @todo This needs investigation into possible shapes,
 * this is shape is what we know is stable & is low risk, other information here is unknown
 * @see https://orcid.org/PUT_ORCID_ID_HERE/public-record.json
 */
export interface ORCIDUser {
    title: string;
    displayName?: string;
    names: {
        visibility: {
            errors: string[];
            required: boolean;
            getRequiredMessage: null;
            visibility: string;
        };
        givenNames: ORCIDName;
        familyName: ORCIDName;
        creditName: ORCIDName;
    };
}
