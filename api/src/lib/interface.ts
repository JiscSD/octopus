import { Languages, LicenceType, Prisma, PublicationFlagCategoryEnum, PublicationType, Role } from '@prisma/client';
import {
    APIGatewayProxyEventPathParameters,
    APIGatewayProxyEventQueryStringParameters,
    APIGatewayProxyEventV2
} from 'aws-lambda';
import * as publicationService from 'publication/service';

export {
    ImageExtension,
    Languages,
    LicenceType,
    PublicationFlagCategoryEnum,
    PublicationStatusEnum,
    PublicationType,
    Role
} from '@prisma/client';
export { JSONSchemaType, Schema } from 'ajv';
export { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2, APIGatewayProxyResultV2 } from 'aws-lambda';
export { HandlerLambda } from 'middy';

export type RequestType = 'body' | 'queryStringParameters' | 'pathParameters';

export interface APIRequest<
    BodyOverride = string | undefined,
    QueryStringParametersOverride = APIGatewayProxyEventQueryStringParameters | undefined,
    PathParamsOverride = APIGatewayProxyEventPathParameters | undefined
> extends Omit<APIGatewayProxyEventV2, 'body' | 'queryStringParameters' | 'pathParameters'> {
    body: BodyOverride;
    queryStringParameters: QueryStringParametersOverride;
    pathParameters: PathParamsOverride;
    user?: User;
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
    language?: Languages;
    fundersStatement: string;
    ethicalStatement?: string;
    ethicalStatementFreeText?: string;
    dataPermissionsStatement?: string;
    dataPermissionsStatementProvidedBy?: string;
    dataAccessStatement?: string;
    selfDeclaration?: boolean;
    affiliationStatement?: string;
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

export interface GetSeedDataPublicationsFilters {
    title: string;
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
    language?: Languages;
    ethicalStatement?: string;
    ethicalStatementFreeText?: string;
    dataPermissionsStatement?: string;
    dataPermissionsStatementProvidedBy?: string;
    dataAccessStatement?: string;
    selfDeclaration?: boolean;
}

export type PublicationOrderBy = 'publishedDate' | '_score';
export type UserOrderBy = 'id' | 'firstName' | 'lastName' | 'createdAt' | 'updatedAt';
export type OrderDirection = 'asc' | 'desc';

export interface PublicationFilters {
    search?: string;
    limit: number;
    offset: number;
    type: string;
    exclude?: string;
    dateFrom?: string;
    dateTo?: string;
    orderBy?: PublicationOrderBy;
    orderDirection?: OrderDirection;
}

export type PublicationWithMetadata = Prisma.PromiseReturnType<typeof publicationService.get>;

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
 * Verification
 */

export interface UpdateVerificationInformation {
    orcid: string;
    email: string;
    code: string;
}

export interface RequestVerificationCodeParameters {
    email: string;
}

export interface ConfirmVerificationCodeBody {
    code: string;
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
    works: Array<{
        publishedDate?: UserDates | null;
        doi?: string | null;
        title?: string | null;
        url?: string | null;
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
        works: {
            group: Array<{
                'work-summary': Array<{
                    'created-date': OrcidValue;
                    'last-modified-date': OrcidValue;
                    title: {
                        title: OrcidValue;
                    };
                    url: OrcidValue;
                    type: string;
                    'publication-date'?: {
                        year: OrcidValue;
                        month: OrcidValue;
                        day: OrcidValue;
                    };
                    'journal-title': OrcidValue;
                    'external-ids': {
                        'external-id': Array<{
                            'external-id-type': string;
                            'external-id-value': string;
                        }>;
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

// @description Bookmarks

export interface CreateBookmarkPathParams {
    id: string;
}

export interface RemoveBookmarkPathParams {
    id: string;
}

export interface GetBookmarkPathParams {
    id: string;
}

export interface GetAllBookmarkPathParams {
    id: string;
}

/**
 * @description References
 */

export type ReferenceType = 'URL' | 'DOI' | 'TEXT';

export interface Reference {
    id: string;
    publicationId: string;
    type: ReferenceType;
    text: string;
    location?: string;
}

export interface CreateReferencePath {
    id: string;
}

export interface UpdateReferencePath {
    id: string;
    referenceId: string;
}

export interface RemoveAllReferencesPathParams {
    id: string;
}

export interface OctopusInformation {
    publications: PublicationType[];
    languages: Languages[];
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

export interface EmailSendOptions {
    to: string;
    subject: string;
    html: string;
    text: string;
}

export interface CreateFunderPathParams {
    id: string;
}

export interface DeleteFunderPathParams {
    id: string;
    funder: string;
}

export interface CreateFunderRequestBody {
    name: string;
    ror?: string;
    city: string;
    country: string;
    link: string;
}

export interface GetFlagByID {
    id: string;
}

export interface GetFlagsByUserID {
    id: string;
}

export interface GetFlagsByPublicationID {
    id: string;
}

export interface DOIResponse {
    data: {
        id: string;
        type: 'dois';
        attributes: {
            doi: string;
            prefix: string;
            suffix: string;
        };
    };
}

//affiliations

export interface CreateAffiliationPathParams {
    id: string;
}

export interface DeleteAffiliationPathParams {
    id: string;
    affiliation: string;
}

export interface CreateAffiliationRequestBody {
    name: string;
    ror?: string;
    city: string;
    country: string;
    link: string;
}

export type UserPublicationsOrderBy = 'id' | 'title' | 'type' | 'publishedDate' | 'createdAt' | 'updatedAt';

export interface UserPublicationsFilters {
    offset: number;
    limit: number;
    orderBy?: UserPublicationsOrderBy;
    orderDirection?: OrderDirection;
}
