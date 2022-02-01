import * as Types from '@types';

export interface NavMenuItem {
    label: string;
    value: string;
}

export interface PublicationStatus {
    status: string;
    createdAt: string;
    id: string;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
}

export type PublicationType =
    | 'PROBLEM'
    | 'PROTOCOL'
    | 'ANALYSIS'
    | 'REAL_WORLD_APPLICATION'
    | 'HYPOTHESIS'
    | 'DATA'
    | 'INTERPRETATION'
    | 'PEER_REVIEW';

export interface Publication {
    id: string;
    url_slug: string;
    type: PublicationType;
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

export interface SearchResult extends Publication {
    // May be different?
}

export interface JSON {
    [key: string]: Types.JSONValue;
}

export interface SearchResultMeta {
    total: number;
    limit: number;
    offset: number;
}
