import * as testUtils from 'lib/testUtils';

describe('Delete a piece of additional information', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('User can delete additional information from their DRAFT publication version', async () => {
        const deleteAdditionalInformation = await testUtils.agent
            .delete(
                '/publication-versions/publication-problem-draft-v1/additional-information/publication-problem-draft-additional-information'
            )
            .query({ apiKey: '000000005' });

        expect(deleteAdditionalInformation.status).toEqual(200);
    });

    test('User cannot delete additional information from a non-existent publication version', async () => {
        const deleteAdditionalInformation = await testUtils.agent
            .delete(
                '/publication-versions/made-up-publication-version/additional-information/publication-problem-draft-additional-information'
            )
            .query({ apiKey: '000000005' });

        expect(deleteAdditionalInformation.status).toEqual(404);
        expect(deleteAdditionalInformation.body.message).toEqual('This publication version does not exist.');
    });

    test('User cannot delete non-existent additional information from an existing publication version', async () => {
        const deleteAdditionalInformation = await testUtils.agent
            .delete('/publication-versions/publication-problem-draft-v1/additional-information/made-up-id')
            .query({ apiKey: '000000005' });

        expect(deleteAdditionalInformation.status).toEqual(404);
        expect(deleteAdditionalInformation.body.message).toEqual(
            'This piece of additional information was not found on the publication version.'
        );
    });

    test('User cannot delete additional information from their LIVE publication version', async () => {
        const deleteAdditionalInformation = await testUtils.agent
            .delete(
                '/publication-versions/publication-problem-live-v1/additional-information/publication-problem-live-additional-information'
            )
            .query({ apiKey: '123456789' });

        expect(deleteAdditionalInformation.status).toEqual(400);
        expect(deleteAdditionalInformation.body.message).toEqual(
            'You cannot delete additional information from a publication version that is not a draft.'
        );
    });

    test('User cannot delete additional information from a DRAFT publication version they do not own', async () => {
        const deleteAdditionalInformation = await testUtils.agent
            .delete(
                '/publication-versions/publication-problem-draft-v1/additional-information/publication-problem-draft-additional-information'
            )
            .query({ apiKey: '123456789' });

        expect(deleteAdditionalInformation.status).toEqual(403);
        expect(deleteAdditionalInformation.body.message).toEqual(
            'You do not have permission to delete additional information from this publication version.'
        );
    });
});
