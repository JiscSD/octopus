import * as Helpers from '@helpers';

describe('Validate emails tests', () => {
    it('Valid emails', () => {
        const emails = [
            'email@example.com',
            'firstname.lastname@example.com',
            'email@subdomain.example.com',
            'email@example-one.com',
            'email@example.name',
            'email+octopus@gmail.com',
            'email@example.museum',
            'email@example.co.jp',
            'firstname-lastname@example.com'
        ];
        emails.map((email) => {
            const valid = Helpers.validateEmail(email);
            expect(valid).toBeTruthy();
        });
    });

    it('Invalid emails', () => {
        const emails = [
            'plainaddress',
            '#@%^%#$@#$@#.com',
            '@example.com',
            'Joe Smith <email@example.com>',
            'email.example.com',
            'email@example@example.com',
            '.email@example.com',
            'email.@example.com',
            'email..email@example.com',
            'email@example.com (Joe Smith)',
            'email@example',
            'email@-example.com',
            'email@111.222.333.44444',
            'email@example..com',
            'Abc..123@example.com'
        ];
        emails.map((email) => {
            const valid = Helpers.validateEmail(email);
            expect(valid).toBeFalsy();
        });
    });
});
