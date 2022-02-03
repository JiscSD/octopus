import * as testUtils from 'lib/testUtils';

import * as linkService from 'link/service';

describe('Create links', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.initialSeed();
    });

    test('User can create link from HYPOTHESIS (in DRAFT) to PROBLEM (LIVE)', async () => {
        const link = await testUtils.agent
            .post('/links')
            .query({
                apiKey: '123456789'
            })
            .send({
                to: 'publication-problem-live',
                from: 'publication-hypothesis-draft'
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
                to: 'publication-problem-live',
                from: 'publication-hypothesis-draft'
            });

        expect(linkAttemptOne.statusCode).toEqual(200);

        const linkAttemptTwo = await testUtils.agent
            .post('/links')
            .query({
                apiKey: '123456789'
            })
            .send({
                to: 'publication-problem-live',
                from: 'publication-hypothesis-draft'
            });

        expect(linkAttemptTwo.statusCode).toEqual(404);
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

        expect(link.statusCode).toEqual(404);
    });

    test('User cannot create a link from HYPOTHESIS (in DRAFT) to PROBLEM (in DRAFT)', async () => {
        const link = await testUtils.agent
            .post('/links')
            .query({
                apiKey: '123456789'
            })
            .send({
                to: 'publication-hypothesis-draft',
                from: 'publication-problem-draft'
            });

        expect(link.statusCode).toEqual(404);
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

        expect(link.statusCode).toEqual(404);
    });
});

describe('canLinkBeCreatedBetweenPublicationTypes', () => {
    describe('Should return true', () => {
        test('PROBLEM -> HYPOTHESIS', () => {
            const result = linkService.canLinkBeCreatedBetweenPublicationTypes('PROBLEM', 'HYPOTHESIS');
            expect(result).toEqual(true);
        });

        test('PROBLEM -> DATA', () => {
            const result = linkService.canLinkBeCreatedBetweenPublicationTypes('PROBLEM', 'DATA');
            expect(result).toEqual(true);
        });

        test('PROBLEM -> INTERPRETATION', () => {
            const result = linkService.canLinkBeCreatedBetweenPublicationTypes('PROBLEM', 'INTERPRETATION');
            expect(result).toEqual(true);
        });

        test('PROBLEM -> PROBLEM', () => {
            const result = linkService.canLinkBeCreatedBetweenPublicationTypes('PROBLEM', 'PROBLEM');
            expect(result).toEqual(true);
        });

        test('HYPOTHESIS -> PROBLEM', () => {
            const result = linkService.canLinkBeCreatedBetweenPublicationTypes('HYPOTHESIS', 'PROBLEM');
            expect(result).toEqual(true);
        });

        test('PROTOCOL -> HYPOTHESIS', () => {
            const result = linkService.canLinkBeCreatedBetweenPublicationTypes('PROTOCOL', 'HYPOTHESIS');
            expect(result).toEqual(true);
        });

        test('DATA -> PROTOCOL', () => {
            const result = linkService.canLinkBeCreatedBetweenPublicationTypes('DATA', 'PROTOCOL');
            expect(result).toEqual(true);
        });

        test('ANALYSIS -> DATA', () => {
            const result = linkService.canLinkBeCreatedBetweenPublicationTypes('ANALYSIS', 'DATA');
            expect(result).toEqual(true);
        });

        test('INTERPRETATION -> ANALYSIS', () => {
            const result = linkService.canLinkBeCreatedBetweenPublicationTypes('INTERPRETATION', 'ANALYSIS');
            expect(result).toEqual(true);
        });

        test('REAL_WORLD_APPLICATION -> INTERPRETATION', () => {
            const result = linkService.canLinkBeCreatedBetweenPublicationTypes(
                'REAL_WORLD_APPLICATION',
                'INTERPRETATION'
            );
            expect(result).toEqual(true);
        });

        test('PEER_REVIEW -> INTERPRETATION', () => {
            const result = linkService.canLinkBeCreatedBetweenPublicationTypes('PEER_REVIEW', 'INTERPRETATION');
            expect(result).toEqual(true);
        });

        test('PEER_REVIEW -> PROBLEM', () => {
            const result = linkService.canLinkBeCreatedBetweenPublicationTypes('PEER_REVIEW', 'PROBLEM');
            expect(result).toEqual(true);
        });
    });
    describe('Should return false', () => {
        test('PEER_REVIEW -> PEER_REVIEW', () => {
            const result = linkService.canLinkBeCreatedBetweenPublicationTypes('PEER_REVIEW', 'PEER_REVIEW');
            expect(result).toEqual(false);
        });

        test('INTERPRETATION -> PROBLEM', () => {
            const result = linkService.canLinkBeCreatedBetweenPublicationTypes('INTERPRETATION', 'PROBLEM');
            expect(result).toEqual(false);
        });

        test('PROTOCOL -> DATA', () => {
            const result = linkService.canLinkBeCreatedBetweenPublicationTypes('PROTOCOL', 'DATA');
            expect(result).toEqual(false);
        });
    });
});
