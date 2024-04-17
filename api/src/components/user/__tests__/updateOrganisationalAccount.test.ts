import * as testUtils from 'lib/testUtils';
import * as userController from 'user/controller';

describe('Update organisational account', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Organisational account can be updated', async () => {
        const newName = 'Updated name';
        const updatedAccount = await userController.updateOrganisationalAccount('test-organisational-account-1', {
            name: newName
        });

        expect(updatedAccount).toHaveProperty('firstName', newName);
    });

    test('Non-organisational accounts cannot be updated with this function', async () => {
        const updatedAccount = await userController.updateOrganisationalAccount('test-user-1', {
            name: 'Updated name'
        });

        expect(updatedAccount).toEqual('The supplied user ID does not belong to an existing organisational account.');
    });

    test('Email address must be valid', async () => {
        const updatedAccount = await userController.updateOrganisationalAccount('test-organisational-account-1', {
            email: 'not an email address'
        });

        expect(updatedAccount).toEqual('Supplied email address must be valid.');
    });

    test('At least one applicable property must be provided', async () => {
        const updatedAccount = await userController.updateOrganisationalAccount('test-organisational-account-1', {});

        expect(updatedAccount).toEqual('No applicable field values have been supplied.');
    });

    test('Default publication ID must belong to a real publication', async () => {
        const updatedAccount = await userController.updateOrganisationalAccount('test-organisational-account-1', {
            defaultPublicationId: 'not a real ID'
        });

        expect(updatedAccount).toEqual('Default publication not found.');
    });

    test("Default publication ID must belong to one of the account's own publications", async () => {
        const updatedAccount = await userController.updateOrganisationalAccount('test-organisational-account-1', {
            defaultPublicationId: 'publication-2'
        });

        expect(updatedAccount).toEqual('Default publication is not owned by this user.');
    });

    test('Default publication ID can be set', async () => {
        const updatedAccount = await userController.updateOrganisationalAccount('test-organisational-account-1', {
            defaultPublicationId: 'organisational-account-publication-1'
        });

        expect(updatedAccount).toHaveProperty('defaultPublicationId', 'organisational-account-publication-1');
    });

    test('API key can be regenerated', async () => {
        const updatedAccount = await userController.updateOrganisationalAccount(
            'test-organisational-account-1',
            {},
            true
        );

        expect(updatedAccount).toHaveProperty('apiKey');
        expect(updatedAccount).not.toHaveProperty('apiKey', '000000012');
    });
});
