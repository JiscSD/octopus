import { render, screen } from '@testing-library/react';

import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as Types from '@/types';

const organisationalAccountWithoutUrl = {
    id: 'test1',
    linkedUser: 'test',
    confirmedCoAuthor: true,
    approvalRequested: true,
    email: 'test@jisc.ac.uk',
    publicationVersionId: 'test',
    affiliations: [],
    isIndependent: true,
    user: { firstName: 'Jisc', lastName: '', orcid: '', role: 'ORGANISATION' as Types.UserRole }
};

const organisationalAccountWithUrl = {
    ...organisationalAccountWithoutUrl,
    id: 'test2',
    user: { ...organisationalAccountWithoutUrl.user, url: 'https://test.org' }
};

const standardAccount = {
    ...organisationalAccountWithoutUrl,
    id: 'test3',
    user: {
        firstName: 'John',
        lastName: 'Doe',
        orcid: 'test',
        role: 'USER' as Types.UserRole
    }
};

describe('Organisational account without url', () => {
    beforeEach(() => {
        render(<Components.AuthorList authors={[organisationalAccountWithoutUrl]} />);
    });
    it('Name shown is first name', () => {
        expect(screen.getByText(organisationalAccountWithoutUrl.user.firstName)).toBeInTheDocument();
    });
    it("Link to author's octopus page is present", () => {
        expect(screen.getByRole('link', { name: organisationalAccountWithoutUrl.user.firstName })).toHaveAttribute(
            'href',
            `${Config.urls.viewUser.path}/${organisationalAccountWithoutUrl.linkedUser}`
        );
    });
    it('External link is not present', () => {
        expect(screen.queryByRole('link', { name: "Visit organisation's site" })).not.toBeInTheDocument();
        expect(screen.getAllByRole('link')).toHaveLength(1);
    });
    it('Organisational account icon is present with title', () => {
        expect(screen.getByTitle('Organisational account icon')).toBeInTheDocument();
    });
});

describe('Organisational account with url', () => {
    beforeEach(() => {
        render(<Components.AuthorList authors={[organisationalAccountWithUrl]} />);
    });
    it('External link is present', () => {
        expect(screen.getByRole('link', { name: "Visit organisation's site" })).toHaveAttribute(
            'href',
            organisationalAccountWithUrl.user.url
        );
    });
});

describe('Standard account', () => {
    beforeEach(() => {
        render(<Components.AuthorList authors={[standardAccount]} />);
    });
    it('Abbreviated name is shown', () => {
        expect(screen.getByText(Helpers.abbreviateUserName(standardAccount.user))).toBeInTheDocument();
    });
    it('ORCiD link is present', () => {
        expect(screen.getByRole('link', { name: 'Visit ORCiD profile' })).toHaveAttribute(
            'href',
            'https://sandbox.orcid.org/test'
        );
    });
});

describe('Multiple authors', () => {
    beforeEach(() => {
        render(
            <Components.AuthorList
                authors={[organisationalAccountWithoutUrl, organisationalAccountWithUrl, standardAccount]}
            />
        );
    });
    it('Expected number of entries are shown', () => {
        // 2 entries with 2 links, 1 with 1 link.
        expect(screen.getAllByRole('link')).toHaveLength(5);
    });
    it('Entries are comma-separated correctly', () => {
        expect(screen.getAllByText(',')).toHaveLength(2);
    });
});

describe('No authors', () => {
    it('No entries are shown', () => {
        const { container } = render(<Components.AuthorList authors={[]} />);
        expect(container).toBeEmptyDOMElement();
    });
});
