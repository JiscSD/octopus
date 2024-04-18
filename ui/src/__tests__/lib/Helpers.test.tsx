import * as Helpers from '@/helpers';
import * as Types from '@/types';

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

describe('HTML to text', () => {
    it('Table tags are removed', () => {
        const text = Helpers.htmlToText(
            '<div><table><tr><td>Text in table cell</td></tr></table><p>Text outside table cell</p></div>'
        );
        expect(text).toEqual('Text outside table cell');
    });
});

describe('Name abbreviation tests', () => {
    it('Organisational accounts are abbreviated to "first name"', () => {
        const user = {
            firstName: 'Jisc Software Development Group',
            lastName: '',
            role: 'ORGANISATION' as Types.UserRole
        };
        const abbreviation = Helpers.abbreviateUserName(user);
        expect(abbreviation).toEqual(user.firstName);
    });
    it('Default users are abbreviated to first initial followed by last name', () => {
        const user = {
            firstName: 'John',
            lastName: 'Doe'
        };
        const abbreviation = Helpers.abbreviateUserName(user);
        expect(abbreviation).toEqual('J. Doe');
    });
    it('Nameless users are "abbreviated" to Anon. User', () => {
        const user = {
            firstName: '',
            lastName: ''
        };
        const abbreviation = Helpers.abbreviateUserName(user);
        expect(abbreviation).toEqual('Anon. User');
    });
    it('Empty user objects are "abbreviated" to Anon. User', () => {
        const user = undefined;
        const abbreviation = Helpers.abbreviateUserName(user);
        expect(abbreviation).toEqual('Anon. User');
    });
});
