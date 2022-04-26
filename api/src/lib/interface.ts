import ISO6391 from 'iso-639-1';

import { Prisma, PublicationType, LicenceType, PublicationFlagCategoryEnum, Role } from '@prisma/client';
export {
    PublicationType,
    LicenceType,
    PublicationStatusEnum,
    PublicationFlagCategoryEnum,
    Role,
    ImageExtension
} from '@prisma/client';

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
    language?: string;
}

export interface OpenSearchPublication {
    id: string;
    type: PublicationType;
    title: string | null;
    licence?: LicenceType | null;
    description?: string | null;
    keywords?: string[];
    content?: string | null;
    cleanContent?: string | null;
    publishedDate?: Date | null;
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
    language?: string;
}

export type PublicationOrderBy = 'publishedDate' | '_score';
export type UserOrderBy = 'id' | 'firstName' | 'lastName' | 'createdAt' | 'updatedAt';
export type OrderDirection = 'asc' | 'desc';

export interface PublicationFilters {
    search?: string;
    limit?: string;
    offset?: string;
    type: string;
    exclude: string;
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
    comment: string;
}

export interface AuthorizeRequestBody {
    code: string;
}

export type UserDates = {
    month?: string | null;
    day?: string | null;
    year?: string | null;
};

export interface UpdateUserInformation {
    firstName: string;
    lastName: string;
    employment: Array<{
        organisation?: string | null;
        role?: string | null;
        department?: string | null;
        startDate?: UserDates | null;
        endDate?: UserDates | null;
    }>;
    education: Array<{
        organisation?: string | null;
        role?: string | null;
        department?: string | null;
        startDate?: UserDates | null;
        endDate?: UserDates | null;
    }>;
}

export interface DeletePublicationPathParams {
    id: string;
}

export interface DeleteLinkPathParams {
    id: string;
}

export type ValidStatuses = 'DRAFT' | 'LIVE';
/**
 * ORCID
 */

type OrcidValue = {
    value: string;
};

/**
 * @todo This needs investigation into possible shapes,
 * this is shape is what we know is stable & is low risk, other information here is unknown
 * @see https://orcid.org/PUT_ORCID_ID_HERE/public-record.json
 */
export interface ORCIDUser {
    person: {
        name: {
            'given-names'?: OrcidValue;
            'family-name'?: OrcidValue;
        };
    };
    'activities-summary': {
        employments: {
            'affiliation-group': Array<{
                summaries: Array<{
                    'employment-summary': {
                        'department-name'?: string;
                        'role-title'?: string;
                        'start-date'?: {
                            year: OrcidValue;
                            month: OrcidValue;
                            day: OrcidValue;
                        };
                        'end-date'?: {
                            year: OrcidValue;
                            month: OrcidValue;
                            day: OrcidValue;
                        };
                        organization: {
                            name?: string;
                        };
                    };
                }>;
            }>;
        };
        educations: {
            'affiliation-group': Array<{
                summaries: Array<{
                    'education-summary': {
                        'department-name'?: string;
                        'role-title'?: string;
                        'start-date'?: {
                            year: OrcidValue;
                            month: OrcidValue;
                            day: OrcidValue;
                        };
                        'end-date'?: {
                            year: OrcidValue;
                            month: OrcidValue;
                            day: OrcidValue;
                        };
                        organization: {
                            name?: string;
                        };
                    };
                }>;
            }>;
        };
    };
}

/**
 * @description Coauthor
 */
export interface CreateCoAuthorRequestBody {
    email: string;
}

export interface CreateCoAuthorPathParams {
    id: string;
}

export interface DeleteCoAuthorPathParams {
    id: string;
    coauthor: string;
}

export interface ConfirmCoAuthorPathParams {
    id: string;
}

export interface ConfirmCoAuthorBody {
    email: string;
    code: string;
    approve: boolean;
}

export interface ChangeCoAuthorRequestBody {
    confirm: boolean;
}
export interface UpdateCoAuthorPathParams {
    id: string;
}

export interface ImageSentBody {
    name: string;
    image: string;
}

/* @description Ratings
 */

export type Ratings =
    | 'PROBLEM_WELL_DEFINED'
    | 'PROBLEM_ORIGINAL'
    | 'PROBLEM_IMPORTANT'
    | 'HYPOTHESIS_WELL_DEFINED'
    | 'HYPOTHESIS_ORIGINAL'
    | 'HYPOTHESIS_SCIENTIFICALLY_VALID'
    | 'PROTOCOL_CLEAR'
    | 'PROTOCOL_ORIGINAL'
    | 'PROTOCOL_APPROPRIATE_TEST_OF_HYPOTHESIS'
    | 'DATA_WELL_ANNOTATED'
    | 'DATA_SIZE_OF_DATASET'
    | 'DATA_FOLLOWED_PROTOCOL'
    | 'ANALYSIS_CLEAR'
    | 'ANALYSIS_ORIGINAL'
    | 'ANALYSIS_APPROPRIATE_METHODOLOGY'
    | 'INTERPRETATION_CLEAR'
    | 'INTERPRETATION_INSIGHTFUL'
    | 'INTERPRETATION_CONSISTENT_WITH_DATA'
    | 'REAL_WORLD_APPLICATION_CLEAR'
    | 'REAL_WORLD_APPLICATION_APPROPRIATE_TO_IMPLEMENT'
    | 'REAL_WORLD_APPLICATION_IMPACTFUL'
    | 'REVIEW_CLEAR'
    | 'REVIEW_INSIGHTFUL'
    | 'REVIEW_ORIGINAL';

export interface CreateRatingRequestBody {
    type: Ratings;
    value: number;
}

export interface OctopusInformation {
    publications: {
        [key in PublicationType]: {
            ratingCategories: Ratings[];
        };
    };
}
export interface CreateFlagCommentBody {
    comment: string;
}

export interface CreateFlagCommentPathParams {
    id: string;
}

export interface ResolveFlagPathParams {
    id: string;
}

export interface DestroyImagePathParams {
    id: string;
}

export interface GetRatingsQueryParams {
    user?: string;
}
