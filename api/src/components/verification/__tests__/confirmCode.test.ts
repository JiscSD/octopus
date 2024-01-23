import * as testUtils from 'lib/testUtils';
import * as cheerio from 'cheerio';

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
        const email = 'example@domain.com';

        await testUtils.agent.get('/verification/0000-0000-0000-0001').query({ apiKey: 123456789, email });

        const inbox = await testUtils.getEmails(email);
        const emailContent = inbox.items[0].Content.Body.replace(/3D"/g, '"'); // get rid of email encoding "3D"

        // get verification code using cheerio
        const $ = cheerio.load(emailContent);
        const code = $('p[id="verification-code"]').text();

        const confirm = await testUtils.agent.post('/verification/0000-0000-0000-0001').send({ code });

        expect(confirm.status).toEqual(200);
    });
});
