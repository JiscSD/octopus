import * as testUtils from 'lib/testUtils';
import * as userController from 'user/controller';

describe('Create organisational accounts', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Basic organisational accounts can be created', async () => {
        const createAccounts = await userController.createOrganisationalAccounts([
            {
                name: 'Organisation 1'
            },
            {
                name: 'Organisation 2'
            }
        ]);

        expect(createAccounts).toHaveLength(2);
    });

    test('Email address must be valid', async () => {
        const createAccounts = await userController.createOrganisationalAccounts([
            {
                name: 'Organisation 1',
                email: 'test.user@jisc.ac.uk'
            },
            {
                name: 'Organisation 2',
                email: 'not an email address'
            }
        ]);

        expect(createAccounts).toEqual('Supplied email addresses must be valid.');
    });
});
