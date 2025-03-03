import * as testUtils from 'lib/testUtils';

describe('Batch update co-authors', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    const problemDraft1DefaultCoAuthors = [
        {
            id: 'coauthor-test-user-5-problem-draft',
            email: 'test-user-5@jisc.ac.uk',
            confirmedCoAuthor: true,
            linkedUser: 'test-user-5',
            isIndependent: true,
            affiliations: []
        },
        {
            id: 'coauthor-test-user-6-problem-draft',
            email: 'test-user-6@jisc.ac.uk',
            confirmedCoAuthor: true,
            linkedUser: 'test-user-6'
        },
        {
            id: 'coauthor-test-user-7-problem-draft',
            email: 'test-user-7@jisc.ac.uk',
            confirmedCoAuthor: false
        },
        {
            id: 'coauthor-test-user-8-problem-draft',
            email: 'test-user-8@jisc.ac.uk',
            confirmedCoAuthor: false
        }
    ];

    test('Corresponding author can update all co-authors', async () => {
        const updateCoAuthors = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-v1/coauthors')
            .send(problemDraft1DefaultCoAuthors)
            .query({ apiKey: '000000005' });

        expect(updateCoAuthors.status).toEqual(200);
    });

    test('Data must be array', async () => {
        const updateCoAuthors = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-v1/coauthors')
            .send({
                guess: true,
                fields: 'no idea'
            })
            .query({ apiKey: '000000005' });

        expect(updateCoAuthors.status).toEqual(400);
        expect(updateCoAuthors.body.message[0].message).toEqual('must be array');
    });

    test('Co-author ID is required', async () => {
        const updateCoAuthors = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-v1/coauthors')
            .send([
                {
                    guess: true,
                    fields: 'no idea'
                }
            ])
            .query({ apiKey: '000000005' });

        expect(updateCoAuthors.status).toEqual(400);
        expect(updateCoAuthors.body.message[0].message).toEqual("must have required property 'id'");
    });

    test('Co-author email is required', async () => {
        const updateCoAuthors = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-v1/coauthors')
            .send([
                {
                    guess: true,
                    id: 'okay-what-else'
                }
            ])
            .query({ apiKey: '000000005' });

        expect(updateCoAuthors.status).toEqual(400);
        expect(updateCoAuthors.body.message[0].message).toEqual("must have required property 'email'");
    });

    test('Cannot update all on non-existent publication version', async () => {
        const updateCoAuthors = await testUtils.agent
            .put('/publication-versions/made-up-version/coauthors')
            .send(problemDraft1DefaultCoAuthors)
            .query({ apiKey: '000000005' });

        expect(updateCoAuthors.status).toEqual(404);
        expect(updateCoAuthors.body.message).toEqual('This publication version does not exist.');
    });

    test('Cannot update all on a LIVE publication version', async () => {
        const updateCoAuthors = await testUtils.agent
            .put('/publication-versions/publication-problem-live-v1/coauthors')
            .send(problemDraft1DefaultCoAuthors)
            .query({ apiKey: '123456789' });

        expect(updateCoAuthors.status).toEqual(400);
        expect(updateCoAuthors.body.message).toEqual(
            'This publication version is LIVE and therefore cannot be edited.'
        );
    });

    test('Duplicate email addresses are rejected', async () => {
        const updateCoAuthors = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-v1/coauthors')
            .send([
                ...problemDraft1DefaultCoAuthors,
                {
                    id: 'brand-new-co-author',
                    email: problemDraft1DefaultCoAuthors[0].email
                }
            ])
            .query({ apiKey: '000000005' });

        expect(updateCoAuthors.status).toEqual(400);
        expect(updateCoAuthors.body.message).toEqual(
            'Duplicate co-authors supplied. Make sure all email addresses are unique.'
        );
    });

    test('Corresponding author cannot remove themself', async () => {
        const updateCoAuthors = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-v1/coauthors')
            .send(problemDraft1DefaultCoAuthors.slice(1))
            .query({ apiKey: '000000005' });

        expect(updateCoAuthors.status).toEqual(403);
        expect(updateCoAuthors.body.message).toEqual(
            'You are not allowed to remove yourself from the publication version.'
        );
    });

    test('Co-author whose approval has been requested receives email when removed', async () => {
        const updateCoAuthors = await testUtils.agent
            .put('/publication-versions/locked-publication-problem-confirmed-co-authors-v1/coauthors')
            // Exclude test-user-2 from request body.
            .send([
                {
                    id: 'test-user-1',
                    email: 'test-user-1@jisc.ac.uk',
                    code: 'test-user-1',
                    approvalRequested: true,
                    confirmedCoAuthor: true,
                    linkedUser: 'test-user-1',
                    isIndependent: true,
                    affiliations: []
                }
            ])
            .query({ apiKey: '123456789' });

        expect(updateCoAuthors.status).toEqual(200);

        // Search for emails to co-author ommitted from request body.
        const searchMail = await testUtils.getEmails('test-user-2@jisc.ac.uk');
        expect(searchMail.messages[0].Subject).toEqual('You are no longer listed as a co-author');
    });

    test('Co-author cannot update all co-authors', async () => {
        const updateCoAuthors = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-v1/coauthors')
            .send(problemDraft1DefaultCoAuthors)
            .query({ apiKey: '000000006' });

        expect(updateCoAuthors.status).toEqual(403);
        expect(updateCoAuthors.body.message).toEqual('You do not have the right permissions for this action.');
    });
});
