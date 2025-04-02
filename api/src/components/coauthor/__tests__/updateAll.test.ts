import * as client from 'lib/client';
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
            affiliations: [],
            retainApproval: true
        },
        {
            id: 'coauthor-test-user-6-problem-draft',
            email: 'test-user-6@jisc.ac.uk',
            confirmedCoAuthor: true,
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
    ];

    test('Corresponding author can update all co-authors', async () => {
        const updateCoAuthors = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-v1/coauthors')
            .send(problemDraft1DefaultCoAuthors)
            .query({ apiKey: '000000005' });

        expect(updateCoAuthors.status).toEqual(200);
    });

    test('Co-authors order can be changed', async () => {
        const differentOrder = [
            ...problemDraft1DefaultCoAuthors.slice(0, 2),
            problemDraft1DefaultCoAuthors[3],
            problemDraft1DefaultCoAuthors[2]
        ];
        const updateCoAuthors = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-v1/coauthors')
            .send(differentOrder)
            .query({ apiKey: '000000005' });

        expect(updateCoAuthors.status).toEqual(200);

        const getCoAuthors = await testUtils.agent
            .get('/publication-versions/publication-problem-draft-v1/coauthors')
            .query({ apiKey: '000000005' });

        expect(getCoAuthors.status).toEqual(200);
        expect(getCoAuthors.body).toMatchObject(differentOrder);
    });

    test('Co-authors can be added', async () => {
        const newCoAuthors = [
            ...problemDraft1DefaultCoAuthors,
            {
                id: 'brand-new-co-author',
                email: 'brand-new-co-author@jisc.ac.uk'
            }
        ];

        const updateCoAuthors = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-v1/coauthors')
            .send(newCoAuthors)
            .query({ apiKey: '000000005' });

        expect(updateCoAuthors.status).toEqual(200);

        const getCoAuthors = await testUtils.agent
            .get('/publication-versions/publication-problem-draft-v1/coauthors')
            .query({ apiKey: '000000005' });

        expect(getCoAuthors.status).toEqual(200);
        expect(getCoAuthors.body[4]).toHaveProperty('email', newCoAuthors[4].email);
    });

    test('Co-authors can be removed', async () => {
        const newCoAuthors = problemDraft1DefaultCoAuthors.slice(0, 2);

        const updateCoAuthors = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-v1/coauthors')
            .send(newCoAuthors)
            .query({ apiKey: '000000005' });

        expect(updateCoAuthors.status).toEqual(200);

        const getCoAuthors = await testUtils.agent
            .get('/publication-versions/publication-problem-draft-v1/coauthors')
            .query({ apiKey: '000000005' });

        expect(getCoAuthors.status).toEqual(200);
        expect(getCoAuthors.body).toMatchObject(newCoAuthors);
    });

    test('Co-authors can be added and removed at the same time', async () => {
        const newCoAuthors = [
            ...problemDraft1DefaultCoAuthors.slice(0, 3),
            {
                id: 'brand-new-co-author',
                email: 'brand-new-co-author@jisc.ac.uk'
            }
        ];

        const updateCoAuthors = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-v1/coauthors')
            .send(newCoAuthors)
            .query({ apiKey: '000000005' });

        expect(updateCoAuthors.status).toEqual(200);

        const getCoAuthors = await testUtils.agent
            .get('/publication-versions/publication-problem-draft-v1/coauthors')
            .query({ apiKey: '000000005' });

        expect(getCoAuthors.status).toEqual(200);
        expect(getCoAuthors.body.slice(0, 3)).toMatchObject(problemDraft1DefaultCoAuthors.slice(0, 3));
        expect(getCoAuthors.body[3]).toHaveProperty('email', newCoAuthors[3].email);
    });

    test('Email can be edited', async () => {
        const newCoAuthors = [
            ...problemDraft1DefaultCoAuthors.slice(0, 2),
            {
                ...problemDraft1DefaultCoAuthors[2],
                email: 'i-changed-email-provider@shiny.new.domain'
            },
            problemDraft1DefaultCoAuthors[3]
        ];

        const updateCoAuthors = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-v1/coauthors')
            .send(newCoAuthors)
            .query({ apiKey: '000000005' });

        expect(updateCoAuthors.status).toEqual(200);

        const getCoAuthors = await testUtils.agent
            .get('/publication-versions/publication-problem-draft-v1/coauthors')
            .query({ apiKey: '000000005' });

        expect(getCoAuthors.status).toEqual(200);
        expect(getCoAuthors.body).not.toMatchObject(problemDraft1DefaultCoAuthors);
        expect(getCoAuthors.body).not.toMatchObject(newCoAuthors);
    });

    test('Other than email and position, no other fields can be changed', async () => {
        const changedCoAuthor = {
            ...problemDraft1DefaultCoAuthors[3],
            // Attempting to change these fields.
            confirmedCoAuthor: true,
            approvalRequested: true,
            retainApproval: false,
            linkedUser: 'some-user',
            createdAt: '2000-01-01T00:00:00.000Z',
            reminderDate: '2010-01-01T00:00:00.000Z',
            isIndependent: true
        };
        const newCoAuthors = [...problemDraft1DefaultCoAuthors.slice(0, 3), changedCoAuthor];

        const updateCoAuthors = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-v1/coauthors')
            .send(newCoAuthors)
            .query({ apiKey: '000000005' });

        expect(updateCoAuthors.status).toEqual(200);

        const coAuthorAttemptedToChange = await client.prisma.coAuthors.findUnique({
            where: {
                id: changedCoAuthor.id
            }
        });

        expect(coAuthorAttemptedToChange?.confirmedCoAuthor).not.toEqual(changedCoAuthor.confirmedCoAuthor);
        expect(coAuthorAttemptedToChange?.approvalRequested).not.toEqual(changedCoAuthor.approvalRequested);
        expect(coAuthorAttemptedToChange?.retainApproval).not.toEqual(changedCoAuthor.retainApproval);
        expect(coAuthorAttemptedToChange?.linkedUser).not.toEqual(changedCoAuthor.linkedUser);
        expect(coAuthorAttemptedToChange?.createdAt).not.toEqual(changedCoAuthor.createdAt);
        expect(coAuthorAttemptedToChange?.reminderDate).not.toEqual(changedCoAuthor.reminderDate);
        expect(coAuthorAttemptedToChange?.isIndependent).not.toEqual(changedCoAuthor.isIndependent);
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

    test('Invalid links are removed if deleting a co-author makes them invalid', async () => {
        // Confirm that a link exists between the 2 draft publications.
        // test-user-1 is corresponding author on data-draft and co-author on protocol-draft.
        const queryCondition = {
            publicationToId: 'publication-protocol-draft',
            publicationFromId: 'publication-data-draft',
            draft: true
        };
        const linkCountBefore = await client.prisma.links.count({
            where: queryCondition
        });
        expect(linkCountBefore).toEqual(1);

        // Update co-authors to remove test-user-1 from protocol-draft.
        const updateCoAuthors = await testUtils.agent
            .put('/publication-versions/publication-protocol-draft-v1/coauthors')
            .send([
                {
                    id: 'coauthor-test-user-5-protocol-draft',
                    email: 'test-user-5@jisc.ac.uk',
                    code: 'test-code-user-5',
                    confirmedCoAuthor: true,
                    linkedUser: 'test-user-5',
                    affiliations: [],
                    isIndependent: true
                },
                {
                    id: 'coauthor-test-user-6-protocol-draft',
                    email: 'test-user-6@jisc.ac.uk',
                    code: 'test-code-user-6',
                    confirmedCoAuthor: true,
                    linkedUser: 'test-user-6',
                    affiliations: [],
                    isIndependent: true
                }
            ])
            .query({ apiKey: '000000005' });

        expect(updateCoAuthors.status).toEqual(200);

        // Count links again.
        // test-user-1 is no longer on protocol-draft, so the link to it should be removed.
        const linkCountAfter = await client.prisma.links.count({
            where: queryCondition
        });
        expect(linkCountAfter).toEqual(0);
    });
});
