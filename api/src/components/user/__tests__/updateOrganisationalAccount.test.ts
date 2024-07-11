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

        expect(updatedAccount).toEqual('Supplied email addresses must be valid.');
    });

    test('At least one applicable property must be provided', async () => {
        const updatedAccount = await userController.updateOrganisationalAccount('test-organisational-account-1', {});

        expect(updatedAccount).toEqual('No applicable field values have been supplied.');
    });

    test('Default topic ID must belong to a real topic', async () => {
        const updatedAccount = await userController.updateOrganisationalAccount('test-organisational-account-1', {
            defaultTopic: {
                title: 'Made up topic',
                ids: {
                    int: 'not a real ID',
                    prod: 'not a real ID'
                }
            }
        });

        expect(updatedAccount).toEqual('Topic not found with ID not a real ID.');
    });

    test('Default topic ID can be set', async () => {
        const updatedAccount = await userController.updateOrganisationalAccount('test-organisational-account-1', {
            defaultTopic: {
                title: 'Test topic',
                ids: {
                    int: 'test-topic-1',
                    prod: 'placeholder'
                }
            }
        });

        expect(updatedAccount).toHaveProperty('defaultTopicId', 'test-topic-1');
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
