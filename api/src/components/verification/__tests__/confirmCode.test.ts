import * as testUtils from 'lib/testUtils';

describe('Confirm a verification code', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('User receives an error on incorrect code', async () => {
        const email = 'example@domain.com';

        await testUtils.agent.get('/verification/0000-0000-0000-0001').query({ apiKey: 123456789, email });

        const code = 'wrong';

        const confirm = await testUtils.agent.post('/verification/0000-0000-0000-0001').send({ code });

        expect(confirm.status).toEqual(400);
    });

    test('User receives not found on three incorrect code attempts', async () => {
        const email = 'example@domain.com';

        await testUtils.agent.get('/verification/0000-0000-0000-0002').query({ apiKey: 123456789, email });

        const code = 'wrong';

        const attemptOne = await testUtils.agent.post('/verification/0000-0000-0000-0002').send({ code });
        const attemptTwo = await testUtils.agent.post('/verification/0000-0000-0000-0002').send({ code });
        const attemptThree = await testUtils.agent.post('/verification/0000-0000-0000-0002').send({ code });

        expect(attemptOne.status).toEqual(400);
        expect(attemptTwo.status).toEqual(400);
        expect(attemptThree.status).toEqual(404);
    });

    test('User can confirm a correct verification code', async () => {
        const address = 'example@domain.com';

        await testUtils.agent.get('/verification/0000-0000-0000-0001').query({ apiKey: 123456789, email: address });

        const emails = await testUtils.getEmails(address);
        const emailId = emails.messages[0].ID;
        const email = await testUtils.getEmail(emailId);
        const code = email.Text.slice(-7); // Get code from end of email text body.

        const confirm = await testUtils.agent.post('/verification/0000-0000-0000-0001').send({ code });

        expect(confirm.status).toEqual(200);
    });
});
