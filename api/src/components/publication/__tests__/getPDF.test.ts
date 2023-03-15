import * as testUtils from 'lib/testUtils';

describe('Generate publication PDFs', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Generate PDF file for a given publication', async () => {
        const publicationId = 'publication-2';
        const response = await testUtils.agent.get(`/publications/${publicationId}/pdf`);

        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty('pdfUrl');
        expect(response.body?.pdfUrl?.includes(`${publicationId}.pdf`)).toBe(true);
    });

    test('Returns 404 if the publication does not exist', async () => {
        const publicationId = 'some-fake-publication-id';
        const response = await testUtils.agent.get(`/publications/${publicationId}/pdf`);

        expect(response.statusCode).toEqual(404);
    });
});
