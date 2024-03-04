import * as Interfaces from '@/interfaces';

export const testPublication: Interfaces.Publication = {
    id: 'test',
    type: 'PROBLEM',
    doi: 'testdoi',
    url_slug: 'test',
    linkedTo: [],
    linkedFrom: [],
    publicationFlags: [],
    versions: [
        {
            id: 'test-v1',
            versionOf: 'test',
            versionNumber: 1,
            isLatestVersion: true,
            isLatestLiveVersion: true,
            createdBy: 'test',
            createdAt: '2023-02-27T09:50:00.000Z',
            updatedAt: '2023-02-28T09:50:00.000Z',
            currentStatus: 'LIVE',
            publishedDate: '2023-02-28T09:50:00.000Z',
            title: 'Test publication',
            licence: 'CC_BY',
            conflictOfInterestStatus: false,
            conflictOfInterestText: null,
            ethicalStatement: null,
            ethicalStatementFreeText: null,
            dataPermissionsStatement: null,
            dataPermissionsStatementProvidedBy: null,
            dataAccessStatement: null,
            selfDeclaration: false,
            description: null,
            keywords: [],
            content: null,
            language: 'en',
            fundersStatement: null,
            user: {
                id: 'test',
                orcid: 'test',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john_doe@mailinator.com',
                createdAt: '2023-02-27T09:50:00.000Z',
                updatedAt: '2023-02-27T09:50:00.000Z'
            },
            publicationStatus: [
                {
                    status: 'LIVE',
                    createdAt: '2023-02-28T09:50:00.000Z',
                    id: 'test-status-2'
                },
                {
                    status: 'DRAFT',
                    createdAt: '2023-02-27T09:50:00.000Z',
                    id: 'test-status-1'
                }
            ],
            funders: [],
            coAuthors: [],
            publication: {
                id: 'test',
                type: 'PROBLEM',
                doi: 'testdoi',
                url_slug: 'test'
            },
            topics: [],
            additionalInformation: []
        }
    ]
};

export const testUser = {
    id: 'test',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john_doe@mailinator.com',
    role: 'USER',
    createdAt: '2023-02-27T09:50:00.000Z',
    updatedAt: '2023-02-27T09:50:00.000Z',
    orcid: 'test',
    education: [],
    employment: [],
    publicationVersions: [],
    works: []
};
