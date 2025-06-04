import * as Interfaces from '@/interfaces';

export const testCoreUser: Interfaces.CoreUser = {
    id: 'test',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john_doe@mailinator.com',
    role: 'USER',
    createdAt: '2023-02-27T09:50:00.000Z',
    updatedAt: '2023-02-27T09:50:00.000Z',
    orcid: 'test',
    employment: []
};

export const testPublicationVersion: Interfaces.PublicationVersion = {
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
    user: testCoreUser as Interfaces.PublicationVersionUser,
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
    coAuthors: [
        {
            id: 'test-coauthor',
            confirmedCoAuthor: true,
            linkedUser: testCoreUser.id,
            approvalRequested: false,
            email: testCoreUser.email as string,
            publicationVersionId: 'test-v1',
            affiliations: [],
            isIndependent: true,
            retainApproval: true,
            user: {
                firstName: testCoreUser.firstName,
                lastName: testCoreUser.lastName,
                role: testCoreUser.role,
                orcid: testCoreUser.orcid
            }
        }
    ],
    publication: {
        id: 'test',
        type: 'PROBLEM',
        doi: 'testdoi',
        url_slug: 'test'
    },
    topics: [],
    additionalInformation: []
};

export const testPublication: Interfaces.Publication = {
    id: testPublicationVersion.versionOf,
    type: 'PROBLEM',
    doi: 'testdoi',
    url_slug: 'test',
    linkedTo: [],
    linkedFrom: [],
    publicationFlags: [],
    versions: [testPublicationVersion]
};

export const testUser: Interfaces.User = {
    ...testCoreUser,
    education: [],
    publicationVersions: [],
    works: []
};

export const testUser2: Interfaces.User = {
    ...testUser,
    id: 'anothertestuser',
    firstName: 'John2',
    lastName: 'Doe2',
    email: 'john_doe2@mailinator.com'
};

export const testLinkedPublication: Interfaces.LinkedPublication = {
    id: 'test',
    type: 'PROBLEM',
    doi: 'testdoi',
    title: testPublicationVersion.title,
    publishedDate: '2023-02-28T09:50:00.000Z',
    currentStatus: 'LIVE',
    createdBy: testUser.id,
    authorFirstName: testUser.firstName,
    authorLastName: testUser.lastName,
    authors: [],
    flagCount: 0,
    peerReviewCount: 0
};

export const testLinkedFromPublication: Interfaces.LinkedFromPublication = {
    ...testLinkedPublication,
    linkId: 'testlink',
    draft: false,
    parentPublicationId: 'test',
    parentPublicationType: 'PROBLEM'
};

export const testLinkedToPublication: Interfaces.LinkedToPublication = {
    ...testLinkedPublication,
    linkId: 'testlink',
    draft: false,
    childPublicationId: 'test-child',
    childPublicationType: 'PROBLEM',
    externalSource: null
};

export const testFlag: Interfaces.Flag = {
    id: 'testflag',
    category: 'PLAGIARISM',
    publicationId: testPublication.id,
    resolved: false,
    createdAt: '2023-02-28T09:50:01.000Z',
    createdBy: testUser2.id,
    user: {
        id: testUser2.id,
        firstName: testUser2.firstName,
        lastName: testUser2.lastName,
        role: testUser2.role,
        createdAt: testUser2.createdAt,
        updatedAt: testUser2.updatedAt,
        orcid: testUser2.orcid,
        employment: testUser2.employment
    }
};

export const testCrosslink: Interfaces.RelativeCrosslink = {
    id: 'test',
    linkedPublication: {
        id: 'test-1',
        latestLiveVersion: {
            title: testPublicationVersion.title,
            publishedDate: '2024-04-11T11:47:00.000Z',
            user: {
                id: testCoreUser.id,
                firstName: testCoreUser.firstName,
                lastName: testCoreUser.lastName
            },
            coAuthors: [
                {
                    linkedUser: testCoreUser.id,
                    user: {
                        firstName: testCoreUser.firstName,
                        lastName: testCoreUser.lastName,
                        role: testCoreUser.role
                    }
                }
            ]
        }
    },
    score: 0,
    createdBy: testUser2.id,
    createdAt: '2024-04-11T10:47:00.000Z'
};
