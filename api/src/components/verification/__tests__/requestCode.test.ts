import * as testUtils from 'lib/testUtils';

describe('Request a verification code', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('User can request a code and receives an email to their address', async () => {
        const email = 'example@domain.com';

        const request = await testUtils.agent.get('/verification/1234').query({ apiKey: 123456789, email });

        const inbox = await testUtils.getEmails(email);

        expect(request.status).toEqual(200);
        expect(inbox.items[0].Content.Headers.Subject).toContain('Verify your Octopus account');
    });
});
