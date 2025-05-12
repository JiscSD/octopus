import * as testUtils from 'lib/testUtils';

describe('Get co-authors of a publication version', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Corresponding author can get co-authors', async () => {
        const getCoAuthors = await testUtils.agent
            .get('/publication-versions/publication-problem-draft-v1/coauthors')
            .query({ apiKey: '000000005' });

        expect(getCoAuthors.status).toEqual(200);
        expect(getCoAuthors.body).toMatchObject([
            {
                id: 'coauthor-test-user-5-problem-draft',
                email: 'test-user-5@jisc.ac.uk',
                confirmedCoAuthor: true,
                linkedUser: 'test-user-5',
                isIndependent: true,
                affiliations: [],
                retainApproval: true
            },
            {
                id: 'coauthor-test-user-6-problem-draft',
                email: 'test-user-6@jisc.ac.uk',
                confirmedCoAuthor: false,
                linkedUser: 'test-user-6',
                retainApproval: true
            },
            {
                id: 'coauthor-test-user-7-problem-draft',
                email: 'test-user-7@jisc.ac.uk',
                confirmedCoAuthor: false,
                retainApproval: true
            },
            {
                id: 'coauthor-test-user-8-problem-draft',
                email: 'test-user-8@jisc.ac.uk',
                confirmedCoAuthor: false,
                retainApproval: true
            }
        ]);
    });

    test('Co-author can get co-authors', async () => {
        const getCoAuthors = await testUtils.agent
            .get('/publication-versions/publication-problem-draft-v1/coauthors')
            .query({ apiKey: '000000006' });

        expect(getCoAuthors.status).toEqual(200);
        // Only the email of the requesting coauthor themselves should be returned.
        const coAuthors = getCoAuthors.body;
        coAuthors.forEach((coAuthor) => {
            if (coAuthor.linkedUser === 'test-user-6') {
                expect(coAuthor).toHaveProperty('email');
            } else {
                expect(coAuthor).not.toHaveProperty('email');
            }
        });
    });

    test('Authenticated user who is not a confirmed co-author cannot get co-authors', async () => {
        const getCoAuthors = await testUtils.agent
            .get('/publication-versions/publication-problem-draft-v1/coauthors')
            .query({ apiKey: '000000007' });

        expect(getCoAuthors.status).toEqual(403);
        expect(getCoAuthors.body.message).toEqual(
            'You do not have permission to view the co-authors of this publication version.'
        );
    });

    test('Anonymous user cannot get co-authors', async () => {
        const getCoAuthors = await testUtils.agent.get('/publication-versions/publication-problem-draft-v1/coauthors');

        expect(getCoAuthors.status).toEqual(401);
    });
});
