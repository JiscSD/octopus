import * as I from 'interface';
import * as testUtils from 'lib/testUtils';
import * as userController from 'user/controller';

describe('Create organisational accounts', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Organisational accounts can be created', async () => {
        const inputData: I.CreateOrganisationalAccountInput[] = [
            {
                name: 'Organisation 1',
                email: 'info@test.ac.uk',
                ror: 'example',
                url: 'https://test.ac.uk',
                defaultTopic: {
                    title: 'Test topic',
                    ids: {
                        int: 'test-topic-1',
                        prod: 'placeholder'
                    }
                }
            },
            {
                name: 'Organisation 2',
                email: 'person@place.gov.uk',
                ror: 'persongovuk123',
                url: 'https://test.gov.uk',
                defaultTopic: {
                    title: 'Test sub-topic A',
                    ids: {
                        int: 'test-topic-1a',
                        prod: 'placeholder'
                    }
                }
            }
        ];
        const createAccounts = await userController.createOrganisationalAccounts(inputData);

        expect(createAccounts).toHaveLength(2);
        expect(createAccounts[0]).toHaveProperty('role', 'ORGANISATION');
        expect(createAccounts[0]).toHaveProperty('firstName', inputData[0].name);
        expect(createAccounts[0]).toHaveProperty('lastName', null);
        expect(createAccounts[0]).toHaveProperty('email', inputData[0].email);
        expect(createAccounts[0]).toHaveProperty('ror', inputData[0].ror);
        expect(createAccounts[0]).toHaveProperty('url', inputData[0].url);
        expect(createAccounts[0]).toHaveProperty('defaultTopicId', inputData[0].defaultTopic?.ids.int);

        expect(createAccounts[1]).toHaveProperty('role', 'ORGANISATION');
        expect(createAccounts[1]).toHaveProperty('firstName', inputData[1].name);
        expect(createAccounts[1]).toHaveProperty('lastName', null);
        expect(createAccounts[1]).toHaveProperty('email', inputData[1].email);
        expect(createAccounts[1]).toHaveProperty('ror', inputData[1].ror);
        expect(createAccounts[1]).toHaveProperty('url', inputData[1].url);
        expect(createAccounts[1]).toHaveProperty('defaultTopicId', inputData[1].defaultTopic?.ids.int);
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

    test('URL must be valid', async () => {
        const createAccounts = await userController.createOrganisationalAccounts([
            {
                name: 'Organisation 1',
                url: 'https://jisc.ac.uk'
            },
            {
                name: 'Organisation 2',
                url: 'not a url'
            }
        ]);

        expect(createAccounts).toEqual('Supplied URLs must be valid.');
    });

    test('Default topic IDs must be valid', async () => {
        const createAccounts = await userController.createOrganisationalAccounts([
            {
                name: 'Organisation 1',
                defaultTopic: {
                    title: 'Test topic',
                    ids: {
                        int: 'test-topic-1',
                        prod: 'placeholder'
                    }
                }
            },
            {
                name: 'Organisation 2',
                defaultTopic: {
                    title: 'Made up topic',
                    ids: {
                        int: 'not-a-topic-id',
                        prod: 'placeholder'
                    }
                }
            }
        ]);

        expect(createAccounts).toEqual('Topic not found with ID not-a-topic-id.');
    });
});
