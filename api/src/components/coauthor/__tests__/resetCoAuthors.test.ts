import * as testUtils from 'lib/testUtils';
import * as client from 'lib/client';

const publication = {
    user1Draft: 'publication-protocol-draft'
};

describe('reset coauthors', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.initialSeed();
    });

    test('Reset all coauthors on a publication', async () => {
        const coauthor = await testUtils.agent
            .patch(`/publications/${publication.user1Draft}/coauthor`)
            .query({ apiKey: '123456789' });

        expect(coauthor.status).toEqual(200);

        const findCoAuthors = await client.prisma.coAuthors.findMany({
            where: {
                publicationId: publication.user1Draft
            }
        });
        expect(findCoAuthors[0].confirmedCoAuthor).toStrictEqual(false);
        expect(findCoAuthors[0].code).not.toEqual('testcode');
    });

    test('Cannot reset co-authors if the user is not the author of a publication', async () => {
        const coauthor = await testUtils.agent
            .patch(`/publications/${publication.user1Draft}/coauthor`)
            .query({ apiKey: '987654321' });

        expect(coauthor.status).toEqual(403);
    });

    test('Cannot reset co-authors on a publication that does not exist', async () => {
        const coauthor = await testUtils.agent
            .patch(`/publications/non-existent-publication/coauthor`)
            .query({ apiKey: '123456789' });

        expect(coauthor.status).toEqual(404);
    });
});
