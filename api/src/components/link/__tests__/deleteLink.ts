import * as testUtils from 'lib/testUtils';

describe('Create links', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.initialSeed();
    });

    test.todo('User can delete a link where they own the fromPublication and it is DRAFT');
    test.todo('User cannot delete a link where they own the fromPublication and it is LIVE');
    test.todo('User cannot delete a link where they do not own the fromPublication and it is DRAFT');
    test.todo('User cannot delete a link where they do not own the fromPublication and it is LIVE');
    test.todo('Unauthenticated user cannot delete a link where they do not own the fromPublication and it is DRAFT');
});
