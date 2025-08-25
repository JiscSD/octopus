import React from 'react';
import * as Types from '@/types';
import * as Axios from 'axios';
import { ParsedUrlQuery } from 'querystring';

export interface JSON {
    [key: string]: Types.JSONValue;
}

export interface JSONResponseError extends Axios.AxiosError {}

export interface NavMenuItem {
    label: string;
    value: string;
    dataTestId?: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
    subItems?: NavMenuItem[];
}

export interface PublicationStatus {
    status: Types.PublicationStatus;
    createdAt: string;
    id: string;
}

export interface CorePublication {
    id: string;
    type: Types.PublicationType;
    doi: string | null;
    url_slug: string;
    externalId?: string;
    externalSource?: Types.PublicationImportSource;
    flagCount?: number;
    peerReviewCount?: number;
}

export interface PublicationVersionUser {
    id: string;
    orcid: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    role: Types.UserRole;
    url?: string;
}
export interface PublicationVersion {
    id: string;
    doi?: string;
    versionOf: string;
    versionNumber: number;
    isLatestVersion: boolean;
    isLatestLiveVersion: boolean;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    currentStatus: Types.PublicationStatus;
    publishedDate: string | null;
    title: string;
    licence: Types.LicenceType;
    conflictOfInterestStatus: boolean | null;
    conflictOfInterestText: string | null;
    ethicalStatement: string | null;
    ethicalStatementFreeText: string | null;
    dataPermissionsStatement: string | null;
    dataPermissionsStatementProvidedBy: string | null;
    dataAccessStatement: string | null;
    selfDeclaration: boolean;
    description: string | null;
    keywords: string[];
    content: string | null;
    language: Types.Languages;
    fundersStatement: string | null;
    user: PublicationVersionUser;
    publicationStatus: PublicationStatus[];
    funders: Funder[];
    coAuthors: CoAuthor[];
    publication: CorePublication;
    topics: BaseTopic[];
    additionalInformation: AdditionalInformation[];
}

export interface Publication extends CorePublication {
    linkedTo: LinkedToPublication[];
    linkedFrom: LinkedFromPublication[];
    publicationFlags: Flag[];
    versions: PublicationVersion[];
}

export interface PublicationBundle {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    entries: {
        id: string;
        position: number;
        publicationId: string;
        publication: {
            authorFirstName: string;
            authorLastName: string;
            id: string;
            publishedDate: string;
            title: string;
            type: Types.PublicationType;
        };
    }[];
}

export type ClientPublicationBundle = Pick<PublicationBundle, 'id' | 'name' | 'entries'>;

type LinkedPublicationAuthor = Pick<CoAuthor, 'id' | 'linkedUser'> & { user: CoAuthor['user'] | null };
export interface LinkedPublication {
    id: string;
    type: Types.PublicationType;
    doi: string;
    title: string | null;
    publishedDate: string | null;
    currentStatus: Types.PublicationStatus;
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
    childPublicationType: Types.PublicationType;
    draft: boolean;
    externalSource: Types.PublicationImportSource | null;
    linkId: string;
    pendingDeletion?: boolean;
}

export interface LinkedFromPublication extends LinkedPublication {
    draft: boolean;
    linkId: string;
    parentPublicationId: string;
    parentPublicationType: Types.PublicationType;
    pendingDeletion?: boolean;
}

export interface PublicationWithLinks {
    publication: LinkedPublication;
    linkedTo: LinkedToPublication[];
    linkedFrom: LinkedFromPublication[];
}

export type ReferenceType = 'URL' | 'DOI' | 'TEXT';

export interface Reference {
    id: string;
    publicationVersionId: string;
    type: ReferenceType;
    text: string;
    location?: string | null;
}

export interface CoAuthor {
    id: string;
    linkedUser?: null | string;
    confirmedCoAuthor: boolean;
    approvalRequested: boolean;
    email: string;
    publicationVersionId: string;
    createdAt?: string;
    reminderDate?: string | null;
    affiliations: MappedOrcidAffiliation[];
    isIndependent: boolean;
    retainApproval: boolean;
    user?: {
        firstName: string;
        lastName: string;
        orcid: string;
        role: Types.UserRole;
        url?: string;
    };
}

export interface OrcidDateRecord {
    day: string | null;
    month: string | null;
    year: string | null;
}

export interface OrcidHistoryRecord {
    department: string | null;
    organisation: string | null;
    role: string | null;
    startDate: OrcidDateRecord;
    endDate: OrcidDateRecord;
}

export interface OrcidWorksRecord {
    doi: string | null;
    url: string | null;
    publishedDate: OrcidDateRecord;
    title: string | null;
}

export interface EmploymentRecord extends OrcidHistoryRecord {}

export interface EducationRecord extends OrcidHistoryRecord {}

export interface WorksRecord extends OrcidWorksRecord {}

export interface CoreUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    role: Types.UserRole;
    createdAt: string;
    updatedAt: string;
    orcid: string;
    employment: EmploymentRecord[];
}
export interface User extends CoreUser {
    education: EducationRecord[];
    employment: EmploymentRecord[];
    publicationVersions: PublicationVersion[];
    works: WorksRecord[];
}

export interface UserSettings {
    enableBookmarkNotifications: boolean;
    enableBookmarkVersionNotifications: boolean;
    enableBookmarkFlagNotifications: boolean;
    enableVersionFlagNotifications: boolean;
    enablePeerReviewNotifications: boolean;
    enableLinkedNotifications: boolean;
}

export interface SearchResults<T extends FlagByUser | Publication | PublicationVersion | PublicationBundle | User> {
    data: T[];
    metadata: SearchResultMeta;
}

export interface SearchResultMeta {
    total: number;
    limit: number;
    offset: number;
}

export interface SearchQueryParams {
    query?: string;
    for?: string;
    type?: string;
    limit?: string;
    offset?: string;
    orderBy?: string;
    orderDirection?: string;
}

export interface LicenceTypeShape {
    value: Types.LicenceType;
    nicename: string;
    description: string;
    link: string;
}

export interface BookmarkedEntityData {
    id: string;
    type: Types.BookmarkType;
    entityId: string;
    userId: string;
    entity: BookmarkedPublication | BookmarkedTopic;
}

export interface BookmarkedPublication {
    id: string;
    title: string | null;
    createdAt: string;
    type: Types.PublicationType;
    publishedDate: string | null;
    coAuthors: Array<{
        user: {
            firstName: string;
            lastName: string | null;
        } | null;
    }>;
    doi: string;
    updatedAt: string;
    user: {
        firstName: string;
        lastName: string | null;
    };
}

export interface BookmarkedTopic {
    id: string;
    title: string;
}

export interface OctopusInformation {
    publicationTypes: {
        [key in Types.PublicationType]: {
            id: Types.PublicationType;
            label: string;
            inlineDescription: string;
            faqDescription: string;
        };
    };
    licences: {
        [key in Types.LicenceType]: {
            value: Types.LicenceType;
            nicename: string;
            fullName: string;
            description: string;
            link: string;
        };
    };
    languages: {
        code: Types.Languages;
        name: string;
    }[];
    redFlagReasons: {
        [key in Types.RedFlagTypes]: {
            value: Types.RedFlagTypes;
            nicename: string;
        };
    };
}

export interface ToastState {
    visible: boolean;
    title: null | string;
    message: null | string;
    icon: null | React.ReactElement;
    dismiss: boolean;
}

export interface TextEditorImage {
    name: string;
    alt: string;
    base64: null | string;
    url: null | string;
    libraryUrl: null | string;
    width: null | string;
}

export interface ImagePreview {
    name: string;
    base64: string;
}

export interface Funder {
    name: string;
    country: string;
    city: string;
    link: string;
    ror?: string;
    grantId?: string;
    id: string;
}

export interface Affiliations {
    name: string;
    country: string;
    city: string;
    link: string;
    ror?: string;
    id: string;
}

export interface FlagComment {
    id: string;
    flagId: string;
    comment: string;
    createdBy: string;
    createdAt: string;
    user: Omit<CoreUser, 'email'>;
}
export interface Flag {
    id: string;
    category: Types.RedFlagTypes;
    publicationId: string;
    resolved: boolean;
    createdAt: string;
    createdBy: string;
    user: Omit<CoreUser, 'email'>;
}

export interface FlagWithComments extends Flag {
    flagComments: FlagComment[];
}

export interface FlagByUser extends Omit<Flag, 'publicationId' | 'user' | 'createdBy'> {
    publication: Pick<CorePublication, 'id' | 'type'> & {
        versions: [
            Pick<PublicationVersion, 'content' | 'description' | 'publishedDate' | 'title'> & {
                coAuthors: {
                    user: Pick<CoreUser, 'firstName' | 'lastName'>;
                }[];
            }
        ];
    };
}

export interface PublicationUpdateRequestBody extends JSON {
    title: string;
    content: string | null;
    description: string | null;
    keywords: string[];
    fundersStatement?: string | null;
    language: Types.Languages;
    conflictOfInterestStatus: boolean | null;
    conflictOfInterestText: string | null;
    ethicalStatement?: string | null;
    ethicalStatementFreeText?: string | null;
    dataAccessStatement?: string | null;
    dataPermissionsStatement?: string | null;
    dataPermissionsStatementProvidedBy?: string | null;
    selfDeclaration?: boolean;
    topics?: string[];
}

export interface CreationStep {
    id: Types.PublicationCreationStep;
    title: string;
    subTitle: string;
    component: React.ReactElement;
    icon: React.ReactElement;
}

export interface CreationStepWithCompletenessStatus extends CreationStep {
    status: Types.TabCompletionStatus;
}

export interface OrcidAffiliationDate {
    year: string | null;
    month: string | null;
    day: string | null;
}

export interface OrcidOrganization {
    name: string;
    address: {
        city: string;
        region: string | null;
        country: string;
    };
    'disambiguated-organization': {
        'disambiguated-organization-identifier': string;
        'disambiguation-source': string;
    } | null;
}

export interface MappedOrcidAffiliation {
    id: number;
    affiliationType:
        | 'membership'
        | 'service'
        | 'invited-position'
        | 'distinction'
        | 'employment'
        | 'education'
        | 'qualification';
    title: string | null;
    departmentName: string | null;
    startDate: OrcidAffiliationDate | null;
    endDate: OrcidAffiliationDate | null;
    organization: OrcidOrganization;
    createdAt: number;
    updatedAt: number;
    source: { name: string; orcid: string };
    url: string | null;
}

export interface TopicPublicationVersion {
    id: string;
    title: string;
    versionOf: string;
}

export interface TopicTranslation {
    id: string;
    topicId: string;
    language: Types.Languages;
    value: string;
}

export interface BaseTopic {
    id: string;
    title: string;
    createdAt: string;
    draft?: boolean;
}

export interface Topic extends BaseTopic {
    updatedAt: string;
    language: string;
    parents: BaseTopic[];
    children: BaseTopic[];
    publicationVersions: TopicPublicationVersion[];
    translations: TopicTranslation[];
}

export interface TopicsPaginatedResults {
    offset: number;
    limit: number;
    total: number;
    results: Pick<BaseTopic, 'id' | 'title' | 'createdAt'>[];
}

export interface TopicsPageQuery extends ParsedUrlQuery {
    query?: string;
}

export interface ControlRequest {
    id: string;
    type: string;
    createdAt: string;
    data: {
        requesterId: string;
        publicationVersion: {
            id: string;
            versionOf: string;
        };
    };
}

export interface AdditionalInformation {
    id: string;
    title: string;
    url: string;
    description: string;
}

export interface AuthorSearchQuery extends ParsedUrlQuery {
    query?: string;
}

// Crosslinking
export interface Crosslink {
    id: string;
    publications: [
        {
            id: string;
            title: string;
        },
        {
            id: string;
            title: string;
        }
    ];
    upvotes: number;
    downvotes: number;
    createdBy: string;
    createdAt: string;
}

export interface RelativeCrosslink {
    id: string;
    linkedPublication: {
        id: string;
        latestLiveVersion: Pick<PublicationVersion, 'title'> & {
            publishedDate: string;
            user: Pick<PublicationVersionUser, 'id' | 'firstName' | 'lastName'>;
            coAuthors: Array<
                Pick<CoAuthor, 'linkedUser'> & {
                    user: Pick<User, 'firstName' | 'lastName' | 'role'>;
                }
            >;
        };
    };
    score: number;
    createdBy: string;
    createdAt: string;
}

export interface MixedCrosslinks {
    recent: RelativeCrosslink[];
    relevant: RelativeCrosslink[];
}

export interface GetPublicationCrosslinksResponse {
    data: RelativeCrosslink[];
    metadata: SearchResultMeta;
}

export interface GetPublicationMixedCrosslinksResponse {
    data: MixedCrosslinks;
    metadata: SearchResultMeta;
}

export interface CrosslinkVote {
    crosslinkId: string;
    createdBy: string;
    vote: boolean;
}

export interface VisualizationBoxData {
    isDraft: boolean;
    isSelected: boolean;
    renderAsLink: boolean;
    id: string;
    title: string | null;
    type: string;
    createdBy: string;
    authorFirstName: string | null;
    authorLastName: string | null;
    publishedDate: string | null;
    childPublicationIds: string[];
    flagCount: number;
    peerReviewCount: number;
}
