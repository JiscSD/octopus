import * as testUtils from 'lib/testUtils';
import cuid from 'cuid';

describe('create coauthor', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Update co-authors for a specific publication', async () => {
        const coauthor = await testUtils.agent
            .put('/publications/publication-problem-draft/coauthor')
            .query({ apiKey: '000000005' })
            .send([
                {
                    id: cuid(),
                    publicationId: 'publication-problem-draft',
                    email: 'emailtest@emailtest.com',
                    linkedUser: null,
                    approvalRequested: false,
                    confirmedCoAuthor: false
                }
            ]);

        expect(coauthor.status).toEqual(200);
    });

    test('Cannot create a co-author record if the user is not the author of a publication', async () => {
        const coauthor = await testUtils.agent
            .put('/publications/publication-problem-draft/coauthor')
            .query({ apiKey: '987654321' })
            .send([
                {
                    id: cuid(),
                    publicationId: 'publication-problem-draft',
                    email: 'emailtest@emailtest.com',
                    linkedUser: null,
                    approvalRequested: false,
                    confirmedCoAuthor: false
                }
            ]);

        expect(coauthor.status).toEqual(403);
    });

    test('Cannot create a co-author record on a publication that does not exist', async () => {
        const coauthor = await testUtils.agent
            .put('/publications/non-existent-publication/coauthor')
            .query({ apiKey: '123456789' })
            .send([
                {
                    id: cuid(),
                    publicationId: 'non-existent-publication',
                    email: 'emailtest@emailtest.com',
                    linkedUser: null,
                    approvalRequested: false,
                    confirmedCoAuthor: false
                }
            ]);

        expect(coauthor.status).toEqual(404);
    });

    test('Cannot create a co-author record on a publication that is live', async () => {
        const coauthor = await testUtils.agent
            .put('/publications/publication-problem-live/coauthor')
            .query({ apiKey: '123456789' })
            .send([
                {
                    id: cuid(),
                    publicationId: 'publication-problem-live',
                    email: 'emailtest@emailtest.com',
                    linkedUser: null,
                    approvalRequested: false,
                    confirmedCoAuthor: false
                }
            ]);

        expect(coauthor.status).toEqual(403);
    });
});
