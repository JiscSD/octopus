import * as testUtils from 'lib/testUtils';
import { createId } from '@paralleldrive/cuid2';

describe('create coauthor', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Update co-authors for a specific publication version', async () => {
        const coauthor = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-v1/coauthors')
            .query({ apiKey: '000000005' })
            .send([
                {
                    id: 'coauthor-test-user-5-problem-draft',
                    email: 'test-user-5@jisc.ac.uk',
                    code: 'test-code-user-5',
                    confirmedCoAuthor: true,
                    linkedUser: 'test-user-5'
                },
                {
                    id: createId(),
                    publicationId: 'publication-problem-draft',
                    email: 'emailtest@emailtest.com',
                    linkedUser: null,
                    approvalRequested: false,
                    confirmedCoAuthor: false
                }
            ]);

        expect(coauthor.status).toEqual(200);
    });

    test('Cannot create a co-author with duplicate email', async () => {
        const coauthor = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-v1/coauthors')
            .query({ apiKey: '000000005' })
            .send([
                {
                    id: createId(),
                    publicationVersionId: 'publication-problem-draft-v1',
                    email: 'email@test.com',
                    linkedUser: null,
                    approvalRequested: false,
                    confirmedCoAuthor: false
                },
                {
                    id: createId(),
                    publicationVersionId: 'publication-problem-draft-v1',
                    email: 'email@test.com',
                    linkedUser: null,
                    approvalRequested: false,
                    confirmedCoAuthor: false
                },
                {
                    id: createId(),
                    publicationVersionId: 'publication-problem-draft-v1',
                    email: 'fake-email@domain.com',
                    linkedUser: null,
                    approvalRequested: false,
                    confirmedCoAuthor: false
                },
                {
                    id: createId(),
                    publicationVersionId: 'publication-problem-draft-v1',
                    email: 'fake-email@test.com',
                    linkedUser: null,
                    approvalRequested: false,
                    confirmedCoAuthor: false
                }
            ]);
        expect(coauthor.status).toEqual(400);
    });

    test('Cannot create a co-author record if the user is not the author of the publication version', async () => {
        const coauthor = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-v1/coauthors')
            .query({ apiKey: '987654321' })
            .send([
                {
                    id: createId(),
                    publicationVersionId: 'publication-problem-draft-v1',
                    email: 'emailtest@emailtest.com',
                    linkedUser: null,
                    approvalRequested: false,
                    confirmedCoAuthor: false
                }
            ]);

        expect(coauthor.status).toEqual(403);
    });

    test('Cannot create a co-author record on a publication version that does not exist', async () => {
        const coauthor = await testUtils.agent
            .put('/publication-versions/non-existent-publication-version/coauthors')
            .query({ apiKey: '123456789' })
            .send([
                {
                    id: createId(),
                    publicationVersionId: 'non-existent-publication-v1',
                    email: 'emailtest@emailtest.com',
                    linkedUser: null,
                    approvalRequested: false,
                    confirmedCoAuthor: false
                }
            ]);

        expect(coauthor.status).toEqual(404);
    });

    test('Cannot create a co-author record on a publication version that is live', async () => {
        const coauthor = await testUtils.agent
            .put('/publication-versions/publication-problem-live-v1/coauthors')
            .query({ apiKey: '123456789' })
            .send([
                {
                    id: createId(),
                    publicationVersionId: 'publication-problem-live-v1',
                    email: 'emailtest@emailtest.com',
                    linkedUser: null,
                    approvalRequested: false,
                    confirmedCoAuthor: false
                }
            ]);

        expect(coauthor.status).toEqual(400);
    });

    test('Co-author email is converted to lower case on save', async () => {
        await testUtils.agent
            .put('/publication-versions/publication-data-draft-v1/coauthors')
            .query({ apiKey: '123456789' })
            .send([
                {
                    id: createId(),
                    publicationVersionId: 'publication-problem-draft-v1',
                    email: 'MULTIcaseAddress@emailtest.COM',
                    linkedUser: null,
                    approvalRequested: false,
                    confirmedCoAuthor: false
                }
            ]);

        const coAuthors = await testUtils.agent
            .get('/publication-versions/publication-data-draft-v1/coauthors')
            .query({ apiKey: '123456789' });

        expect(coAuthors.body.length).toEqual(2); // corresponding author and this new one
        expect(coAuthors.body[1]).toMatchObject({ email: 'multicaseaddress@emailtest.com' });
    });
});
