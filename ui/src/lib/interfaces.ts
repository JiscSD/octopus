export interface NavMenuItem {
    label: string;
    value: string;
}

interface PublicationStatus {
    status: string;
    createdAt: string;
    id: string;
}

interface User {
    id: string;
    firstName: string;
    lastName: string;
}

export interface SearchResult {
    id: string;
    url_slug: string;
    type: string;
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
