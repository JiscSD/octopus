import React from 'react';
import * as Types from '@types';
import * as Axios from 'axios';

export interface JSON {
    [key: string]: Types.JSONValue;
}

export interface JSONResponseError extends Axios.AxiosError {}

export interface NavMenuItem {
    label: string;
    value: string;
    subItems?: NavMenuItem[] | React.ReactNode[] | any[];
}

export interface PublicationStatus {
    status: Types.PublicationStatuses;
    createdAt: string;
    id: string;
}

export interface PublicationRef {
    id: string;
    title: string;
    publishedDate: string;
    currentStatus: PublicationStatus;
    type: Types.PublicationType;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        orcid: string;
    };
    linkedTo: LinkTo[];
    linkedFrom: LinkFrom[];
}

export interface LinkTo {
    linkedTo: any;
    id: string;
    publicationToRef: PublicationRef;
}

export interface LinkFrom {
    linkedFrom: any;
    id: string;
    publicationFromRef: PublicationRef;
}

export interface CorePublication {
    id: string;
    title: string;
    type: Types.PublicationType;
    doi: string | null;
    description: string;
    keywords: string[];
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    publishedDate: string;
    currentStatus: Types.PublicationStatuses;
    url_slug: string;
    licence: Types.LicenceType;
    content: string;
    language: Types.Languages;
    ethicalStatement: string;
    ethicalStatementFreeText: string | null;
}

export interface Publication extends CorePublication {
    publicationStatus: PublicationStatus[];
    user: User;
    linkedFrom: LinkFrom[];
    linkedTo: LinkTo[];
    conflictOfInterestStatus: boolean | undefined;
    conflictOfInterestText: string | null;
    dataAccessStatement: string | null;
    dataPermissionsStatement: string | null;
    dataPermissionsStatementProvidedBy: string | null;
    selfDeclaration: boolean;
    coAuthors: CoAuthor[];
    funders: Funder[];
    fundersStatement: string | null;
    affiliations: Affiliations[];
    affiliationStatement: string | null;
    publicationFlags: Flag[];
    references: Reference[];
}

export interface PublicationWithLinks {
    rootPublication: Publication;
    linkedToPublications: {
        publicationFrom: string;
        publicationTo: string;
        publicationFromType: Types.PublicationType;
        publicationToType: Types.PublicationType;
        publicationToTitle: string;
        publicationToPublishedDate: string;
        publicationToCurrentStatus: Types.PublicationStatuses;
        publicationToFirstName: string;
        publicationToLastName: string;
    }[];
    linkedFromPublications: {
        publicationFrom: string;
        publicationTo: string;
        publicationFromType: Types.PublicationType;
        publicationToType: Types.PublicationType;
        publicationFromTitle: string;
        publicationFromPublishedDate: string;
        publicationFromCurrentStatus: Types.PublicationStatuses;
        publicationFromFirstName: string;
        publicationFromLastName: string;
    }[];
}

export type ReferenceType = 'URL' | 'DOI' | 'TEXT';

export interface Reference {
    id: string;
    publicationId: string;
    type: ReferenceType;
    text: string;
    location?: string | null;
}

export interface CoAuthor {
    id: string;
    linkedUser: null | string;
    confirmedCoAuthor: boolean;
    email: string;
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
    publications: Publication[];
    works: WorksRecord[];
}

export interface SearchResults<T extends Publication | User> {
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

export interface BookmarkedPublicationsData {
    id: string;
    publicationId: string;
    userId: string;
    publication: BookmarkedPublication;
}

export interface BookmarkedPublication {
    id: string;
    title: string;
    publicationId: string;
    createdAt: string;
    currentStatus: string;
    url_slug: string;
    description: string;
    type: Types.PublicationType;
    publishedDate: string;
    coAuthors: Array<{
        user: {
            firstName: string;
            lastName: string;
            id: string;
        };
    }>;
    doi: string;
    updatedAt: string;
    user: {
        firstName: string;
        lastName: string;
    };
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
    user: Omit<CoreUser, 'email'>;
}

export interface FlagWithComments extends Flag {
    flagComments: FlagComment[];
}

export interface PublicationUpdateRequestBody extends JSON {
    title: string;
    content: string;
    description: string;
    keywords: string[];
    licence: Types.LicenceType;
    fundersStatement?: string | null;
    language: Types.Languages;
    conflictOfInterestStatus: boolean | undefined;
    conflictOfInterestText: string;
    ethicalStatement?: string | null;
    ethicalStatementFreeText?: string | null;
    dataAccessStatement?: string | null;
    dataPermissionsStatement?: string | null;
    dataPermissionsStatementProvidedBy?: string | null;
    selfDeclaration?: boolean;
    affiliationStatement?: string | null;
}

export interface CreationStep {
    title: string;
    subTitle: string;
    component: React.ReactElement;
    icon: React.ReactElement;
}

export interface UserPublication {
    id: string;
    createdAt: string;
    updatedAt: string;
    publishedDate: string | null;
    doi: string;
    title: string | null;
    type: Types.PublicationType;
    currentStatus: Types.PublicationStatuses;
    url_slug: string;
    licence: Types.LicenceType;
    content: string | null;
}

export interface UserPublicationsPage {
    offset: number;
    limit: number;
    total: number;
    results: UserPublication[];
}
