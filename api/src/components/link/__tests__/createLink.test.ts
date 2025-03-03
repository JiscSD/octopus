import * as testUtils from 'lib/testUtils';

import * as linkController from 'link/controller';

describe('Create links', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('User can create link from DATA (in DRAFT) to PROTOCOL (LIVE)', async () => {
        const link = await testUtils.agent
            .post('/links')
            .query({
                apiKey: '123456789'
            })
            .send({
                to: 'publication-protocol-live',
                from: 'publication-data-draft'
            });

        expect(link.statusCode).toEqual(200);
    });

    test('User cannot create same link twice', async () => {
        const linkAttemptOne = await testUtils.agent
            .post('/links')
            .query({
                apiKey: '123456789'
            })
            .send({
                to: 'publication-protocol-live',
                from: 'publication-data-draft'
            });

        expect(linkAttemptOne.statusCode).toEqual(200);

        const linkAttemptTwo = await testUtils.agent
            .post('/links')
            .query({
                apiKey: '123456789'
            })
            .send({
                to: 'publication-protocol-live',
                from: 'publication-data-draft'
            });

        expect(linkAttemptTwo.statusCode).toEqual(400);
        expect(linkAttemptTwo.body.message).toEqual('Link already exists.');
    });

    test('User cannot create a link from PROBLEM (LIVE) to HYPOTHESIS (in DRAFT)', async () => {
        const link = await testUtils.agent
            .post('/links')
            .query({
                apiKey: '123456789'
            })
            .send({
                to: 'publication-hypothesis-draft',
                from: 'publication-problem-live'
            });

        expect(link.statusCode).toEqual(400);
        expect(link.body.message).toEqual(
            `Publication with id publication-problem-live is LIVE, so a link cannot be created from it.`
        );
    });

    test('User cannot create a link from HYPOTHESIS (in DRAFT) to PROBLEM (in DRAFT) if they are not an author on the PROBLEM', async () => {
        const link = await testUtils.agent
            .post('/links')
            .query({
                apiKey: '123456789'
            })
            .send({
                to: 'publication-problem-draft',
                from: 'publication-hypothesis-draft-problem-live'
            });

        expect(link.statusCode).toEqual(400);
        expect(link.body.message).toEqual(
            'Publication with id publication-problem-draft is not LIVE, and you are not an author on the DRAFT, so a link cannot be created to it.'
        );
    });

    test('User can create a link from HYPOTHESIS (in DRAFT) to PROBLEM (in DRAFT) if they are an author on the problem', async () => {
        const link = await testUtils.agent
            .post('/links')
            .query({
                apiKey: '123456789'
            })
            .send({
                to: 'publication-problem-draft-with-coi-but-no-text',
                from: 'publication-hypothesis-draft-problem-live'
            });

        expect(link.statusCode).toEqual(200);
    });

    test('Cannot create a link from HYPOTHESIS (in DRAFT) to PROBLEM (LIVE) if no auth', async () => {
        const link = await testUtils.agent.post('/links').send({
            to: 'publication-hypothesis-live',
            from: 'publication-problem-live'
        });

        expect(link.statusCode).toEqual(401);
    });

    test('Cannot create a link from HYPOTHESIS (in DRAFT) to PROBLEM (LIVE) if wrong user', async () => {
        const link = await testUtils.agent
            .post('/links')
            .query({
                apiKey: '987654321'
            })
            .send({
                to: 'publication-problem-live',
                from: 'publication-hypothesis-draft'
            });

        expect(link.statusCode).toEqual(403);
        expect(link.body.message).toEqual(
            'You cannot create a link from the publication with id publication-hypothesis-draft.'
        );
    });
});

describe('canLinkBeCreatedBetweenPublicationTypes', () => {
    describe('Should return true', () => {
        test('PROBLEM -> HYPOTHESIS', () => {
            const result = linkController.canLinkBeCreatedBetweenPublicationTypes('PROBLEM', 'HYPOTHESIS');
            expect(result).toEqual(true);
        });

        test('PROBLEM -> DATA', () => {
            const result = linkController.canLinkBeCreatedBetweenPublicationTypes('PROBLEM', 'DATA');
            expect(result).toEqual(true);
        });

        test('PROBLEM -> INTERPRETATION', () => {
            const result = linkController.canLinkBeCreatedBetweenPublicationTypes('PROBLEM', 'INTERPRETATION');
            expect(result).toEqual(true);
        });

        test('PROBLEM -> PROBLEM', () => {
            const result = linkController.canLinkBeCreatedBetweenPublicationTypes('PROBLEM', 'PROBLEM');
            expect(result).toEqual(true);
        });

        test('HYPOTHESIS -> PROBLEM', () => {
            const result = linkController.canLinkBeCreatedBetweenPublicationTypes('HYPOTHESIS', 'PROBLEM');
            expect(result).toEqual(true);
        });

        test('PROTOCOL -> HYPOTHESIS', () => {
            const result = linkController.canLinkBeCreatedBetweenPublicationTypes('PROTOCOL', 'HYPOTHESIS');
            expect(result).toEqual(true);
        });

        test('DATA -> PROTOCOL', () => {
            const result = linkController.canLinkBeCreatedBetweenPublicationTypes('DATA', 'PROTOCOL');
            expect(result).toEqual(true);
        });

        test('ANALYSIS -> DATA', () => {
            const result = linkController.canLinkBeCreatedBetweenPublicationTypes('ANALYSIS', 'DATA');
            expect(result).toEqual(true);
        });

        test('INTERPRETATION -> ANALYSIS', () => {
            const result = linkController.canLinkBeCreatedBetweenPublicationTypes('INTERPRETATION', 'ANALYSIS');
            expect(result).toEqual(true);
        });

        test('REAL_WORLD_APPLICATION -> INTERPRETATION', () => {
            const result = linkController.canLinkBeCreatedBetweenPublicationTypes(
                'REAL_WORLD_APPLICATION',
                'INTERPRETATION'
            );
            expect(result).toEqual(true);
        });

        test('PEER_REVIEW -> INTERPRETATION', () => {
            const result = linkController.canLinkBeCreatedBetweenPublicationTypes('PEER_REVIEW', 'INTERPRETATION');
            expect(result).toEqual(true);
        });

        test('PEER_REVIEW -> PROBLEM', () => {
            const result = linkController.canLinkBeCreatedBetweenPublicationTypes('PEER_REVIEW', 'PROBLEM');
            expect(result).toEqual(true);
        });
    });
    describe('Should return false', () => {
        test('PEER_REVIEW -> PEER_REVIEW', () => {
            const result = linkController.canLinkBeCreatedBetweenPublicationTypes('PEER_REVIEW', 'PEER_REVIEW');
            expect(result).toEqual(false);
        });

        test('INTERPRETATION -> PROBLEM', () => {
            const result = linkController.canLinkBeCreatedBetweenPublicationTypes('INTERPRETATION', 'PROBLEM');
            expect(result).toEqual(false);
        });

        test('PROTOCOL -> DATA', () => {
            const result = linkController.canLinkBeCreatedBetweenPublicationTypes('PROTOCOL', 'DATA');
            expect(result).toEqual(false);
        });
    });
});
