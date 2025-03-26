import * as testUtils from 'lib/testUtils';

// There are 2 endpoints that do similar jobs in different ways and they should be subject to the same tests.
const directParam = (direct: boolean): string => (direct ? '?direct=true' : '');

const testNonExistentPublication = async (direct: boolean): Promise<void> => {
    const getPublication = await testUtils.agent.get(`/publications/fake/links${directParam(direct)}`);

    expect(getPublication.statusCode).toEqual(404);
};

const testAnonymousUserRequestingDraft = async (direct: boolean): Promise<void> => {
    const getPublication = await testUtils.agent.get(
        `/publications/publication-problem-draft/links${directParam(direct)}`
    );

    expect(getPublication.statusCode).toEqual(404);
};

const testRequestingLive = async (direct: boolean): Promise<void> => {
    const getPublication = await testUtils.agent.get(
        `/publications/publication-hypothesis-live-problem-live/links${directParam(direct)}`
    );

    expect(getPublication.statusCode).toEqual(200);
    expect(getPublication.body.linkedFrom.length).toBeGreaterThan(0);
    expect(getPublication.body.linkedTo.length).toBeGreaterThan(0);
};

const textExpectedFields = async (direct: boolean): Promise<void> => {
    const linkedPublicationFields = [
        'id',
        'type',
        'doi',
        'title',
        'publishedDate',
        'currentStatus',
        'createdBy',
        'authorFirstName',
        'authorLastName',
        'authors',
        'flagCount',
        'peerReviewCount'
    ];

    const getPublication = await testUtils.agent
        .get(`/publications/publication-protocol-draft/links${directParam(direct)}`)
        .query({
            apiKey: '000000005'
        });

    const { publication, linkedFrom, linkedTo } = getPublication.body;
    expect(linkedTo.length).toBeGreaterThan(0);
    expect(linkedFrom.length).toBeGreaterThan(0);

    // Confirm that main publication and linked publications all have common fields.
    for (const linkedPublication of [publication, ...linkedFrom, ...linkedTo]) {
        expect(Object.keys(linkedPublication)).toEqual(expect.arrayContaining(linkedPublicationFields));
    }

    for (const linkedFromPublication of linkedFrom) {
        expect(Object.keys(linkedFromPublication)).toEqual(
            expect.arrayContaining(['draft', 'linkId', 'parentPublicationId', 'parentPublicationType'])
        );
    }

    for (const linkedToPublication of linkedTo) {
        expect(Object.keys(linkedToPublication)).toEqual(
            expect.arrayContaining(['childPublicationId', 'childPublicationType', 'draft', 'externalSource', 'linkId'])
        );
    }
};

const testAuthorRequestingDraft = async (direct: boolean): Promise<void> => {
    const getPublication = await testUtils.agent
        .get(`/publications/publication-problem-live-2/links${directParam(direct)}`)
        .query({
            apiKey: '123456789'
        });

    expect(getPublication.statusCode).toEqual(200);
    expect(getPublication.body.publication).toMatchObject({
        currentStatus: 'DRAFT',
        publishedDate: null
    });
};

const testAuthorRequestingNewDraft = async (direct: boolean): Promise<void> => {
    const getPublication = await testUtils.agent
        .get(`/publications/publication-problem-live-2/links${directParam(direct)}`)
        .query({
            apiKey: '123456789'
        });

    expect(getPublication.statusCode).toEqual(200);
    expect(getPublication.body.publication).toMatchObject({
        currentStatus: 'DRAFT',
        publishedDate: null
    });
};

const testAnonymousUserRequestingNewDraft = async (direct: boolean): Promise<void> => {
    const getPublication = await testUtils.agent.get(
        `/publications/publication-problem-live-2/links${directParam(direct)}`
    );

    expect(getPublication.statusCode).toEqual(200);
    expect(getPublication.body.publication).toMatchObject({
        currentStatus: 'LIVE',
        publishedDate: '2022-01-22T15:51:42.523Z'
    });
};

const testHiddenAuthorDetails = async (direct: boolean): Promise<void> => {
    const getPublication = await testUtils.agent
        .get(`/publications/publication-protocol-draft/links${directParam(direct)}`)
        .query({
            apiKey: '000000005'
        });

    expect(getPublication.statusCode).toEqual(200);
    expect(getPublication.body.linkedFrom[0]).toMatchObject({
        authorFirstName: null,
        authorLastName: null,
        authors: null
    });
};

const testAuthorizedAuthorDetails = async (direct: boolean): Promise<void> => {
    const getPublication = await testUtils.agent
        .get(`/publications/publication-protocol-draft/links${directParam(direct)}`)
        .query({
            apiKey: '123456789'
        });

    expect(getPublication.statusCode).toEqual(200);
    expect(getPublication.body.linkedFrom[0]).toMatchObject({
        authorFirstName: 'Test',
        authorLastName: 'User 1',
        authors: [
            {
                id: 'coauthor-test-user-1-publication-data-draft',
                linkedUser: 'test-user-1',
                user: {
                    orcid: '0000-0000-0000-0001',
                    firstName: 'Test',
                    lastName: 'User 1',
                    role: 'USER',
                    url: null
                }
            },
            {
                id: 'coauthor-test-user-2-publication-data-draft',
                linkedUser: 'test-user-2',
                user: {
                    orcid: '0000-0000-0000-0002',
                    firstName: 'Test',
                    lastName: 'User 2',
                    role: 'USER',
                    url: null
                }
            }
        ]
    });
};

describe('Get links to and from a supplied publication', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    const direct = false;

    test('Responds with 404 for non-existent publication', async () => testNonExistentPublication(direct));

    test('Anonymous user cannot view links of a draft publication', async () =>
        testAnonymousUserRequestingDraft(direct));

    test('Responds with 200 and linked publications for LIVE root publication', async () => testRequestingLive(direct));

    test('Expected fields are present', async () => textExpectedFields(direct));

    test('Author can view links of a draft publication', async () => testAuthorRequestingDraft(direct));

    test('Author gets details of new (v2+) draft of main publication in response', async () =>
        testAuthorRequestingNewDraft(direct));

    test('Non-author only gets live details of publication that has a newer draft', async () =>
        testAnonymousUserRequestingNewDraft(direct));

    test("Linked draft publication's author details are not returned when requester is not an author on it", async () =>
        testHiddenAuthorDetails(direct));

    test("Linked draft publication's author details are returned when requester is an author on it", async () =>
        testAuthorizedAuthorDetails(direct));
});

// This is a similar call but it uses a separate function that uses prisma only, and so should be subject to the same tests.
describe('Get direct links to and from a publication', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    const direct = true;

    test('Responds with 404 for non-existent publication', async () => testNonExistentPublication(direct));

    test('Anonymous user cannot view links of a draft publication', async () =>
        testAnonymousUserRequestingDraft(direct));

    test('Responds with 200 and linked publications for LIVE root publication', async () => testRequestingLive(direct));

    test('Expected fields are present', async () => textExpectedFields(direct));

    test('Author can view links of a draft publication', async () => testAuthorRequestingDraft(direct));

    test('Author gets details of new (v2+) draft of main publication in response', async () =>
        testAuthorRequestingNewDraft(direct));

    test('Non-author only gets live details of publication that has a newer draft', async () =>
        testAnonymousUserRequestingNewDraft(direct));

    test("Linked draft publication's author details are not returned when requester is not an author on it", async () =>
        testHiddenAuthorDetails(direct));

    test("Linked draft publication's author details are returned when requester is an author on it", async () =>
        testAuthorizedAuthorDetails(direct));
});
