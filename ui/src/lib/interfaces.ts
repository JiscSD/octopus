import { AxiosError } from 'axios';

import * as Types from '@types';

export interface JSON {
    [key: string]: Types.JSONValue;
}

export interface JSONResponseError extends AxiosError {}
export interface NavMenuItem {
    label: string;
    value: string;
}

export interface PublicationStatus {
    status: string;
    createdAt: string;
    id: string;
}

export interface Publication {
    id: string;
    url_slug: string;
    type: Types.PublicationType;
    title: string;
    content: string;
    doi: any; // to change
    currentStatus: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    publicationStatus: PublicationStatus[];
    user: User;
    publicationFromRef: any[]; // to change
    publicationToRef: any[]; // to change
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
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
