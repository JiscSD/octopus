import React from 'react';
import * as Types from '@types';
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
    status: Types.PublicationStatuses;
    createdAt: string;
    id: string;
}

export interface PublicationRef {
    id: string;
    type: Types.PublicationType;
    doi: string;
    versions: {
        title: string;
        publishedDate: string;
        currentStatus: PublicationStatus;
        description: string;
        keywords: string[];
        user: User;
    }[];
    linkedTo: LinkTo[];
    linkedFrom: LinkFrom[];
}

export interface LinkTo {
    id: string;
    publicationToRef: PublicationRef;
}

export interface LinkFrom {
    id: string;
    publicationFromRef: PublicationRef;
}

export interface CorePublication {
    id: string;
    type: Types.PublicationType;
    doi: string | null;
    url_slug: string;
}

export interface PublicationVersionUser {
    id: string;
    orcid: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    updatedAt: string;
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
    currentStatus: Types.PublicationStatuses;
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
}

export interface PublicationWithVersions extends CorePublication {
    versions: PublicationVersion[];
}

// The form of publication generally expected by the UI, with versionable data merged into the object.
export interface Publication extends CorePublication {
    versionId: string;
    versionNumber: number;
    isLatestVersion: boolean;
    isLatestLiveVersion: boolean;
    title: string;
    description: string;
    keywords: string[];
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    currentStatus: Types.PublicationStatuses;
    publishedDate: string;
    licence: Types.LicenceType;
    content: string;
    language: Types.Languages;
    ethicalStatement: string;
    ethicalStatementFreeText: string | null;
    publicationStatus: PublicationStatus[];
    user: User;
    conflictOfInterestStatus: boolean | undefined;
    conflictOfInterestText: string | null;
    dataAccessStatement: string | null;
    dataPermissionsStatement: string | null;
    dataPermissionsStatementProvidedBy: string | null;
    selfDeclaration: boolean;
    coAuthors: CoAuthor[];
    funders: Funder[];
    fundersStatement: string | null;
    references: Reference[];
}

export interface LinkedPublication {
    id: string;
    type: Types.PublicationType;
    doi: string;
    title: string;
    publishedDate: string;
    currentStatus: Types.PublicationStatuses;
    createdBy: string;
    authorFirstName: string;
    authorLastName: string;
    authors: Pick<CoAuthor, 'id' | 'linkedUser' | 'publicationVersionId' | 'user'>[];
}

export interface LinkedToPublication extends LinkedPublication {
    linkId: string;
    childPublication: string;
    childPublicationType: Types.PublicationType;
}

export interface LinkedFromPublication extends LinkedPublication {
    linkId: string;
    parentPublication: string;
    parentPublicationType: Types.PublicationType;
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
    user?: {
        firstName: string;
        lastName: string;
        orcid: string;
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
    role: string;
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

export interface SearchResults<T extends PublicationVersion | User> {
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

export interface DocumentationEntry {
    method: string;
    endpoint: string;
    id: string;
    description: string;
    exampleResponse: unknown;
    exampleUse: string;
    queryParameters: DocumentationEntryQueryParams[];
}

export interface DocumentationEntryQueryParams {
    name: string;
    optional: boolean;
    enums?: Array<string>;
    description: string;
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
    publications: {
        [key in Types.PublicationType]: {
            id: Types.PublicationType;
            heading: string;
            content: string;
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

export interface UserPublicationVersionsResult {
    offset: number;
    limit: number;
    total: number;
    results: PublicationVersion[];
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

export interface TopicPublication {
    id: string;
    title: string;
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
}

export interface Topic extends BaseTopic {
    updatedAt: string;
    language: string;
    parents: BaseTopic[];
    children: BaseTopic[];
    publications: TopicPublication[];
    translations: TopicTranslation[];
}

export interface TopicsPaginatedResults {
    offset: number;
    limit: number;
    total: number;
    results: {
        id: string;
        title: string;
        createdAt: Date;
    }[];
}

export interface TopicsPageQuery extends ParsedUrlQuery {
    query?: string;
}
