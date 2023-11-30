import * as client from '../src/lib/client';

// Expects an email address to be supplied to send a notification to. Should be executed like this:
// npm run insertDummyEvent test.example@domain.com
const insertDummyEvent = async (): Promise<string> => {
    if (process.argv[2]) {
        const to = process.argv[2];
        const data = {
            to
        };
        await client.prisma.event.create({
            data: {
                type: 'dummy',
                data
            }
        });

        return 'Done';
    } else {
        console.log('No to address supplied! Please supply one.');

        return 'Failed';
    }
};

insertDummyEvent()
    .then((message) => console.log(message))
    .catch((err) => console.log(err));
