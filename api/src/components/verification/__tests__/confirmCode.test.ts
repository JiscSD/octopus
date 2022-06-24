import * as testUtils from 'lib/testUtils';
import cryptoRandomString from 'crypto-random-string';

describe('Confirm a verification code', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('User receives an error on incorrect code', async () => {
        const email = `${cryptoRandomString({ length: 7, type: 'distinguishable' })}@domain.com`;

        await testUtils.agent.get('/verification/1234').query({ apiKey: 123456789, email });

        const code = 'wrong';

        const confirm = await testUtils.agent.post('/verification/1234').send({ code });

        expect(confirm.status).toEqual(422);
    });

    test('User receives not found on three incorrect code attempts', async () => {
        const email = `${cryptoRandomString({ length: 7, type: 'distinguishable' })}@domain.com`;

        await testUtils.agent.get('/verification/4321').query({ apiKey: 123456789, email });

        const code = 'wrong';

        const attemptOne = await testUtils.agent.post('/verification/4321').send({ code });
        const attemptTwo = await testUtils.agent.post('/verification/4321').send({ code });
        const attemptThree = await testUtils.agent.post('/verification/4321').send({ code });

        expect(attemptOne.status).toEqual(422);
        expect(attemptTwo.status).toEqual(422);
        expect(attemptThree.status).toEqual(404);
    });

    test('User can confirm a correct verification code', async () => {
        const email = `${cryptoRandomString({ length: 7, type: 'distinguishable' })}@domain.com`;

        await testUtils.agent.get('/verification/1234').query({ apiKey: 123456789, email });

        const inbox = await testUtils.getEmails(email);

        const code = inbox.items[0].Content.Body.match(/(?<=<p class=3D"code">)(.*?)(?=<\/p>)/g)[0];

        const confirm = await testUtils.agent.post('/verification/1234').send({ code });

        expect(confirm.status).toEqual(200);
    });
});
