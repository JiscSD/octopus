import {
    BookmarkType,
    EventType,
    Languages,
    LicenceType,
    Prisma,
    PublicationFlagCategoryEnum,
    PublicationImportSource,
    PublicationStatusEnum,
    PublicationType,
    Role
} from '@prisma/client';
import {
    APIGatewayProxyEventPathParameters,
    APIGatewayProxyEventQueryStringParameters,
    APIGatewayProxyEventV2
} from 'aws-lambda';
import * as publicationVersionService from 'publicationVersion/service';
import * as eventService from 'event/service';

export {
    BookmarkType,
    EventType,
    ImageExtension,
    Languages,
    LicenceType,
    PublicationFlagCategoryEnum,
    PublicationImportSource,
    PublicationStatusEnum,
    PublicationType,
    Role,
    Topic
} from '@prisma/client';
export { JSONSchemaType, Schema } from 'ajv';
export {
    APIGatewayProxyEventV2,
    APIGatewayProxyHandlerV2,
    APIGatewayProxyResultV2,
    EventBridgeEvent
} from 'aws-lambda';

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
    body?: string;
    headers: unknown;
    statusCode: number;
}

export type Environment = 'int' | 'prod';

export type SearchResultMeta = {
    total: number;
    limit: number;
    offset: number;
};

/**
 * @description Publications
 */

const prismaGeneratedPublicationType = Prisma.validator<Prisma.PublicationDefaultArgs>()({});
export type Publication = Prisma.PublicationGetPayload<typeof prismaGeneratedPublicationType>;

export interface CreatePublicationRequestBody {
    type: PublicationType;
    title: string;
    licence?: LicenceType;
    content?: string;
    description?: string;
    keywords?: string[];
    conflictOfInterestStatus?: boolean;
    conflictOfInterestText?: string;
    language?: Languages;
    ethicalStatement?: string;
    ethicalStatementFreeText?: string;
    dataPermissionsStatement?: string;
    dataPermissionsStatementProvidedBy?: string;
    dataAccessStatement?: string;
    selfDeclaration?: boolean;
    fundersStatement?: string;
    affiliationStatement?: string;
    topicIds?: string[];
    linkedPublicationIds?: string[];
    externalId?: string;
    externalSource?: PublicationImportSource;
}

export interface CreatePublicationQueryStringParameters {
    directPublish?: boolean;
}

export interface OpenSearchPublication {
    id: string;
    type: PublicationType;
    title: string | null;
    organisationalAuthor: boolean;
    keywords: string[];
    description?: string | null;
    content?: string | null;
    cleanContent?: string | null;
    publishedDate?: Date | null;
}

export interface GetPublicationPathParams {
    publicationId: string;
}

export interface GetPublicatonQueryParams {
    fields?: string;
}

export interface GetPublicationLinksPathParams {
    publicationId: string;
}

export interface GetPublicationLinksQueryParams {
    direct?: string;
}

export interface GetPublicationVersionPathParams {
    publicationId: string;
    version: string;
}

export interface GetSeedDataPublicationsFilters {
    title: string;
}

export interface UpdatePublicationPathParams {
    id: string;
}

export interface UpdatePublicationVersionPathParams {
    publicationVersionId: string;
}

export interface UpdateStatusPathParams {
    publicationVersionId: string;
    status: 'LIVE' | 'DRAFT' | 'LOCKED';
}

export interface UpdateStatusQueryParams {
    ariContactConsent?: boolean;
}

export interface UpdatePublicationVersionRequestBody {
    title?: string;
    description?: string;
    content?: string;
    keywords?: string[];
    language?: Languages;
    topics?: string[];
    ethicalStatement?: string;
    ethicalStatementFreeText?: string;
    dataPermissionsStatement?: string;
    dataPermissionsStatementProvidedBy?: string;
    dataAccessStatement?: string;
    selfDeclaration?: boolean;
    conflictOfInterestStatus?: boolean;
    conflictOfInterestText?: string;
    fundersStatement?: string;
}

export type PublicationOrderBy = 'publishedDate' | '_score';
export type UserOrderBy = 'id' | 'firstName' | 'lastName' | 'createdAt' | 'updatedAt';
export type OrderDirection = 'asc' | 'desc';

export interface OpenSearchPublicationFilters {
    search?: string;
    limit: number;
    offset: number;
    type?: string;
    authorType?: 'individual' | 'organisational';
    exclude?: string;
    dateFrom?: string;
    dateTo?: string;
    orderBy?: PublicationOrderBy;
    orderDirection?: OrderDirection;
}

export type GetPublicationVersionsReportingOptions = Pick<
    OpenSearchPublicationFilters,
    'limit' | 'offset' | 'authorType' | 'dateFrom' | 'dateTo'
>;

export interface GetPublicationVersionsQueryParams extends OpenSearchPublicationFilters {
    format?: 'reporting';
}

export type PublicationVersion = Exclude<Prisma.PromiseReturnType<typeof publicationVersionService.get>, null>;
export type PrivatePublicationVersion = Exclude<
    Prisma.PromiseReturnType<typeof publicationVersionService.privateGet>,
    null
>;

/**
 * @description Links
 */

const prismaGeneratedLinkType = Prisma.validator<Prisma.LinksDefaultArgs>()({});
export type Link = Prisma.LinksGetPayload<typeof prismaGeneratedLinkType>;

export interface CreateLinkBody {
    to: string;
    from: string;
}

export type LinkedPublicationAuthor = Pick<CoAuthor, 'id' | 'linkedUser'> & { user: CoAuthor['user'] | null };
export interface LinkedPublication {
    id: string;
    type: PublicationType;
    doi: string;
    title: string | null;
    publishedDate: string | null;
    currentStatus: PublicationStatusEnum;
    createdBy: string;
    authorFirstName: string | null;
    authorLastName: string | null;
    authors: LinkedPublicationAuthor[] | null;
    flagCount: number;
    peerReviewCount: number;
    // Only returned with ?direct=true on the getPublicationLinks endpoint.
    // Just used at present to show, and link to, the version a Peer Review was created against.
    parentVersionId?: string;
    parentVersionNumber?: number;
    parentVersionIsLatestLive?: boolean;
}

export interface LinkedToPublication extends LinkedPublication {
    childPublicationId: string;
    childPublicationType: PublicationType;
    draft: boolean;
    externalSource: PublicationImportSource | null;
    linkId: string;
}

export interface LinkedFromPublication extends LinkedPublication {
    draft: boolean;
    linkId: string;
    parentPublicationId: string;
    parentPublicationType: PublicationType;
}

export interface PublicationWithLinks {
    publication: LinkedPublication | null;
    linkedTo: LinkedToPublication[];
    linkedFrom: LinkedFromPublication[];
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
    orcid: string | null;
    role: Role;
    defaultTopicId: string | null;
}

export interface UserFilters {
    search?: string;
    role?: Role;
    limit?: string;
    offset?: string;
    orderBy?: UserOrderBy;
    orderDirection?: OrderDirection;
}

export interface GetUserParameters {
    id: string;
}

export interface CreateOrganisationalAccountInput {
    name: string;
    email?: string;
    ror?: string;
    url?: string;
    defaultTopic?: {
        title: string;
        ids: {
            int: string;
            prod: string;
        };
    };
}

export interface UpdateOrganisationalAccountInput {
    intId: string;
    prodId: string;
    name?: string;
    email?: string;
    ror?: string;
    url?: string;
    defaultTopic?: {
        title: string;
        ids: {
            int: string;
            prod: string;
        };
    };
    regenerateApiKey?: boolean;
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

const prismaGeneratedFlagType = Prisma.validator<Prisma.PublicationFlagsDefaultArgs>()({});
export type Flag = Prisma.PublicationFlagsGetPayload<typeof prismaGeneratedFlagType>;

export interface CreateFlagPathParams {
    publicationId: string;
}

export interface CreateFlagRequestBody {
    category: PublicationFlagCategoryEnum;
    comment: string;
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

export interface GetFlagPathParams {
    id: string;
}

export interface GetUserFlagsPathParams {
    id: string;
}

export interface GetUserFlagsQueryParams {
    includeResolved?: boolean;
    limit: number;
    offset: number;
}

export interface GetPublicationFlagsPathParams {
    publicationId: string;
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
    orcidAccessToken: string;
}

export interface DeletePublicationVersionPathParams {
    publicationVersionId: string;
}

export interface CreatePublicationVersionPathParams {
    publicationId: string;
}

export interface RequestControlPathParams {
    publicationId: string;
    version: string;
}

export interface ApproveControlRequestPathParams {
    publicationId: string;
    version: string;
}

export interface ApproveControlRequestBody {
    approve: 'true' | 'false';
    eventId: string;
}

export interface DeleteLinkPathParams {
    id: string;
}

export type ValidStatuses = 'DRAFT' | 'LIVE' | 'LOCKED';
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

export interface CoAuthor {
    id: string;
    linkedUser: null | string;
    confirmedCoAuthor: boolean;
    approvalRequested: boolean;
    retainApproval: boolean;
    email: string;
    publicationVersionId: string;
    createdAt?: string;
    reminderDate?: string | null;
    isIndependent: boolean;
    affiliations: MappedOrcidAffiliation[];
    user?: {
        firstName: string;
        lastName: string | null;
        orcid: string | null;
        role: Role;
        url: string | null;
    };
}

export interface CreateCoAuthorRequestBody {
    email: string;
}

export interface CreateCoAuthorPathParams {
    publicationVersionId: string;
}

export interface DeleteCoAuthorPathParams {
    publicationVersionId: string;
    coauthorId: string;
}

export interface LinkCoAuthorPathParams {
    publicationVersionId: string;
}

export interface ConfirmCoAuthorBody {
    email: string;
    approve: boolean;
    code?: string;
}

export interface ChangeCoAuthorRequestBody {
    confirm: boolean;
    retainApproval: boolean;
}
export interface UpdateCoAuthorPathParams {
    publicationVersionId: string;
}

export interface ImageSentBody {
    name: string;
    image: string;
}

// @description Bookmarks
export type GetBookmarkPathParamType = Lowercase<BookmarkType>;

export interface CreateBookmarkRequestBody {
    type: BookmarkType;
    entityId: string;
}

export interface GetAllBookmarksQueryStringParameters {
    type: BookmarkType;
    entityId?: string;
}

export interface DeleteBookmarkPathParams {
    id: string;
}

export interface BookmarkedPublication {
    id: string;
    title: string | null;
    createdAt: Date;
    type: PublicationType;
    publishedDate: Date | null;
    coAuthors: Array<{
        user: {
            firstName: string;
            lastName: string | null;
        } | null;
    }>;
    doi: string;
    updatedAt: Date;
    user: {
        firstName: string;
        lastName: string | null;
    };
}

export interface BookmarkedTopic {
    id: string;
    title: string;
}

export interface PopulatedBookmark {
    id: string;
    type: BookmarkType;
    entityId: string;
    userId: string;
    entity: BookmarkedPublication | BookmarkedTopic;
}

/**
 * @description References
 */

export type ReferenceType = 'URL' | 'DOI' | 'TEXT';

export interface Reference {
    id: string;
    publicationVersionId: string;
    type: ReferenceType;
    text: string;
    location?: string | null;
}

export type UpdateReferencesBody = Array<Reference>;

export interface CreateReferencePathParams {
    publicationVersionId: string;
}

export interface DestroyImagePathParams {
    id: string;
}

export interface EmailSendOptions {
    to: string | string[];
    subject: string;
    html: string;
    text: string;
}

export interface CreateFunderPathParams {
    publicationVersionId: string;
}

export interface DeleteFunderPathParams {
    publicationVersionId: string;
    funderId: string;
}

export interface CreateFunderRequestBody {
    name: string;
    ror?: string;
    city: string;
    country: string;
    link: string;
    grantId?: string;
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

export interface UpdateAffiliationsPathParams {
    publicationVersionId: string;
}

export interface UpdateAffiliationsBody {
    affiliations: MappedOrcidAffiliation[];
    isIndependent: boolean;
}

export interface UserPublicationsFilters {
    offset: number;
    limit: number;
    query?: string;
    versionStatus?: string;
    initialDraftsOnly?: boolean;
    exclude?: string;
}

export interface SendApprovalReminderPathParams {
    publicationVersionId: string;
    coauthorId: string;
}

type NameType = 'Personal' | 'Organizational';

type DataCiteAffiliation = {
    name: string;
    nameType: NameType;
    affiliationIdentifier: string;
    affiliationIdentifierScheme: string;
};
export interface DataCiteCreator {
    name: string;
    nameType: NameType;
    givenName: string | undefined;
    familyName: string | null;
    nameIdentifiers: DataCiteCreatorNameIdentifiers[];
    affiliation: DataCiteAffiliation[];
}

export interface DataCiteCreatorNameIdentifiers {
    nameIdentifier: string;
    nameIdentifierScheme: string;
    schemeUri: string;
}

export interface DataCiteUser {
    firstName: string;
    lastName: string | null;
    orcid: string | null;
    affiliations: MappedOrcidAffiliation[];
    role: Role;
}
export interface GeneratePDFPathParams {
    publicationId: string;
}

export interface GeneratePDFQueryParams {
    redirectToPreview?: string;
    generateNewPDF?: string;
}

export interface OrcidAffiliationSummaryDate {
    year: {
        value?: string;
    };
    month: {
        value?: string;
    };
    day: {
        value?: string;
    };
}

export interface OrcidOrganization {
    name: string;
    address: {
        city: string;
        region?: string;
        country: string;
    };
    'disambiguated-organization'?: {
        'disambiguated-organization-identifier': string;
        'disambiguation-source': string;
    };
}

export interface OrcidAffiliationSummary {
    'created-date': {
        value: number;
    };
    'last-modified-date': {
        value: number;
    };
    source: {
        'source-orcid'?: {
            uri: string;
            path: string;
            host: string;
        };
        'source-client-id'?: {
            uri: string;
            path: string;
            host: string;
        };
        'source-name': {
            value: string;
        };
        'assertion-origin-orcid'?: string;
        'assertion-origin-client-id'?: string;
        'assertion-origin-name'?: string;
    };
    'put-code': number;
    'department-name'?: string;
    'role-title'?: string;
    'start-date'?: OrcidAffiliationSummaryDate;
    'end-date'?: OrcidAffiliationSummaryDate;
    organization: OrcidOrganization;
    url?: { value: string };
    'external-ids'?: string[];
    'display-index': string;
    visibility: string;
    path: string;
}

export interface OrcidAffiliationDate {
    year: string | null;
    month: string | null;
    day: string | null;
}

/**
 *
 * Relevant affiliation types for Octopus are:
 * - Memberships
 * - Services
 * - Invited Positions
 * - Distinctions
 * - Employments
 * - Educations
 * - Qualifications
 */
export interface MappedOrcidAffiliation {
    id: number;
    affiliationType:
        | 'membership'
        | 'service'
        | 'invited-position'
        | 'distinction'
        | 'employment'
        | 'education'
        | 'qualification'
        | 'misc.';
    title?: string;
    departmentName?: string;
    startDate?: OrcidAffiliationDate;
    endDate?: OrcidAffiliationDate;
    organization: OrcidOrganization;
    createdAt: number;
    updatedAt: number;
    source: { name: string; orcid: string };
    url?: string;
}

export interface AffiliationWithFormattedName extends MappedOrcidAffiliation {
    name: string;
}

export interface LegacyAffiliation {
    name: string;
    country: string;
    city: string;
    link: string;
    ror: string | null;
    id: string;
}

export interface UserEmployment {
    role: string | null;
    endDate: {
        day: string | null;
        month: string | null;
        year: string | null;
    };
    startDate: {
        day: string | null;
        month: string | null;
        year: string | null;
    };
    department: string | null;
    organisation: string;
}

// Topics
export interface TopicTranslation {
    language: Languages;
    value: string;
}

export interface CreateTopicRequestBody {
    title: string;
    language?: Languages;
    translations?: TopicTranslation[];
    parentIds: string[];
}

export interface GetTopicPathParams {
    id: string;
}

export interface TopicsFilters {
    search?: string;
    limit?: number;
    offset?: number;
    exclude?: string;
}

export interface TopicsPaginatedResults extends SearchResultMeta {
    results: {
        id: string;
        title: string;
        createdAt: Date;
    }[];
}

export type Event = Exclude<Prisma.PromiseReturnType<typeof eventService.get>, null>;

// events
export interface RequestControlData extends Record<string, unknown> {
    requesterId: string;
    publicationVersion: {
        id: string;
        versionOf: string;
    };
}

export interface EventDataType {
    [EventType.REQUEST_CONTROL]: RequestControlData;
}

export interface RequestControlEvent extends Record<string, unknown>, Omit<Event, 'data'> {
    data: RequestControlData;
}

// Crosslinking
export interface CreateCrosslinkRequestBody {
    publications: [string, string];
}

export interface DeleteCrosslinkPathParams {
    id: string;
}

export interface SetCrosslinkVotePathParams {
    id: string;
}

export interface SetCrosslinkVoteRequestBody {
    vote: boolean;
}

export interface ResetCrosslinkVotePathParams {
    id: string;
}

export interface GetCrosslinkPathParams {
    id: string;
}

export interface GetCrosslinkVotePathParams {
    id: string;
}

export interface GetPublicationCrosslinksPathParams {
    publicationId: string;
}

export type GetPublicationCrosslinksOrder = 'recent' | 'relevant' | 'mix';
export interface GetPublicationCrosslinksQueryParams {
    search?: string;
    limit?: number;
    offset?: number;
    own?: string;
    order?: GetPublicationCrosslinksOrder;
}

// Options for the service function, as distinct from the query params received in the controller.
export interface GetPublicationCrosslinksOptions extends Omit<GetPublicationCrosslinksQueryParams, 'own'> {
    userIdFilter?: string;
}

// Additional information
export interface CreateAdditionalInformationPathParams {
    publicationVersionId: string;
}

export interface CreateAdditionalInformationBody {
    title: string;
    url: string;
    description?: string;
}

export interface DeleteAdditionalInformationPathParams {
    publicationVersionId: string;
    additionalInformationId: string;
}

export interface ARIQuestion {
    questionId: number;
    postDate: string;
    dateUpdated: string;
    url: string;
    question: string;
    isArchived: boolean;
    department: string;
    questionGroup: string;
    backgroundInformation: string;
    publicationDate: string;
    expiryDate: string | null;
    contactDetails: string;
    topics: string[];
    fieldsOfResearch: string[];
    tags: string[];
    relatedQuestions: {
        questionId: number;
    }[];
    relatedUKRIProjects: {
        projectId: string;
        title: string;
        url: string;
    }[];
}

export type MappedARIQuestion = {
    title: string;
    content: string;
    description: string;
    keywords: string[];
    topicIds: string[];
    externalId: string;
    externalSource: 'ARI';
    userId: User['id'];
};

export type ARIHandlingAction = 'create' | 'update' | 'none';

export interface HandledARI {
    actionTaken: ARIHandlingAction;
    success: boolean;
    message?: string;
    publicationVersion?: PublicationVersion;
    unrecognisedDepartment?: string;
    unrecognisedTopics?: string[];
}

export type IngestReportFormat = 'email' | 'file';

export interface TriggerAriIngestQueryParams {
    apiKey: string;
    dryRun?: boolean;
}

export interface LocalNotifyPubRouterPathParams {
    publicationId: string;
}

export interface CreatePublicationBundleRequestBody {
    name: string;
    publicationIds: string[];
}
