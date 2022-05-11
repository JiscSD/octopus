import React from 'react';
import * as Axios from 'axios';

import * as Types from '@types';

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
    ethicalStatement: boolean | null;
    ethicalStatementFreeText: string | null;
}

export interface Publication extends CorePublication {
    publicationStatus: PublicationStatus[];
    user: User;
    linkedFrom: LinkFrom[];
    linkedTo: LinkTo[];
    conflictOfInterestStatus: boolean;
    conflictOfInterestText: string | null;
    ratings: Rating;
    coAuthors: CoAuthor[];
    funders: Funder[];
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

export interface CoreUser {
    id: string;
    firstName: string;
    lastName: string;
    orcid: string;
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

export interface User extends CoreUser {
    education: EducationRecord[];
    employment: EmploymentRecord[];
    Publication: Publication[];
    works: WorksRecord[];
}

export interface SearchResults {
    data: Publication[] | User[];
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

export interface PublicationBuildingStep {
    title: string;
    subTitle: string;
    component: React.ReactElement;
    icon: React.ReactElement;
}

export interface LicenceTypeShape {
    value: Types.LicenceType;
    nicename: string;
    description: string;
    link: string;
}

export interface Rating {
    aggregate: RatingEntry[];
    overall: {
        _avg: {
            rating: number;
        };
        _count: {
            rating: number;
        };
    };
}

export interface RatingEntry {
    id: string;
    category: Types.Ratings;
    _count: {
        id: number;
    };
    _avg: {
        rating: number | null;
    };
}

export interface OctopusInformation {
    publications: {
        [key in Types.PublicationType]: {
            id: Types.PublicationType;
            heading: string;
            content: string;
            ratings: {
                [key in Types.Ratings]?: {
                    id: Types.Ratings;
                    value: string;
                    description: string;
                    labels: {
                        negative: string;
                        positive: string;
                    };
                };
            };
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
export interface APIRatingShape {
    id: string;
    publicationId: string;
    userId: string;
    rating: number;
    category: Types.Ratings;
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
