import * as testUtils from 'lib/testUtils';
import * as userController from 'user/controller';

describe('Update organisational accounts', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Organisational account can be updated', async () => {
        const newName = 'Updated name';
        const updatedAccounts = await userController.updateOrganisationalAccounts([
            {
                intId: 'test-organisational-account-1',
                prodId: 'placeholder',
                name: newName
            }
        ]);

        expect(updatedAccounts[0]).toHaveProperty('firstName', newName);
    });

    test('Non-organisational accounts cannot be updated with this function', async () => {
        const updatedAccounts = await userController.updateOrganisationalAccounts([
            {
                intId: 'test-user-1',
                prodId: 'placeholder',
                name: 'Updated name'
            }
        ]);

        expect(updatedAccounts[0]).toEqual(
            'The supplied user ID does not belong to an existing organisational account.'
        );
    });

    test('Email address must be valid', async () => {
        const updatedAccounts = await userController.updateOrganisationalAccounts([
            {
                intId: 'test-organisational-account-1',
                prodId: 'placeholder',
                email: 'not an email address'
            }
        ]);

        expect(updatedAccounts[0]).toEqual('Supplied email addresses must be valid.');
    });

    test('At least one applicable property must be provided', async () => {
        const updatedAccounts = await userController.updateOrganisationalAccounts([
            {
                intId: 'test-organisational-account-1',
                prodId: 'placeholder'
            }
        ]);

        expect(updatedAccounts[0]).toEqual('No applicable field values have been supplied.');
    });

    test('Default topic ID must belong to a real topic', async () => {
        const updatedAccounts = await userController.updateOrganisationalAccounts([
            {
                intId: 'test-organisational-account-1',
                prodId: 'placeholder',
                defaultTopic: {
                    title: 'Made up topic',
                    ids: {
                        int: 'not a real ID',
                        prod: 'not a real ID'
                    }
                }
            }
        ]);

        expect(updatedAccounts[0]).toEqual('Topic not found with ID not a real ID.');
    });

    test('Default topic ID can be set', async () => {
        const updatedAccounts = await userController.updateOrganisationalAccounts([
            {
                intId: 'test-organisational-account-1',
                prodId: 'placeholder',
                defaultTopic: {
                    title: 'Test topic',
                    ids: {
                        int: 'test-topic-1',
                        prod: 'placeholder'
                    }
                }
            }
        ]);

        expect(updatedAccounts[0]).toHaveProperty('defaultTopicId', 'test-topic-1');
    });

    test('API key can be regenerated', async () => {
        const updatedAccounts = await userController.updateOrganisationalAccounts([
            {
                intId: 'test-organisational-account-1',
                prodId: 'placeholder',
                regenerateApiKey: true
            }
        ]);

        expect(updatedAccounts[0]).toHaveProperty('apiKey');
        expect(updatedAccounts[0]).not.toHaveProperty('apiKey', '000000012');
    });
});
