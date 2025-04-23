import { render, screen } from '@testing-library/react';

import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as TestUtils from '@/testUtils';

describe('Publication card', () => {
    beforeEach(() => {
        render(<Components.PublicationCard publicationVersion={TestUtils.testPublicationVersion} />);
    });
    it('Title is shown', () => {
        expect(screen.getByText(TestUtils.testPublicationVersion.title)).toBeInTheDocument();
    });
    it('Abbreviated author name is shown', () => {
        expect(
            screen.getByText(Helpers.abbreviateUserName(TestUtils.testPublicationVersion.coAuthors[0].user))
        ).toBeInTheDocument();
    });
    it('Publication type is shown', () => {
        expect(
            screen.getByText(Helpers.formatPublicationType(TestUtils.testPublicationVersion.publication.type))
        ).toBeInTheDocument();
    });
    it('Publication date is shown', () => {
        expect(
            screen.getByText(Helpers.formatDate(TestUtils.testPublicationVersion.publishedDate as string))
        ).toBeInTheDocument();
    });
    it('Link to view publication is shown', () => {
        const viewPublicationLink = screen.getByRole('link', { name: 'View this publication' });
        expect(viewPublicationLink).toBeInTheDocument();
        expect(viewPublicationLink).toHaveAttribute(
            'href',
            `${Config.urls.viewPublication.path}/${TestUtils.testPublicationVersion.versionOf}`
        );
    });
});

describe('Individual cases', () => {
    it('Title is truncated to 69 characters if above 80 characters', () => {
        const longTitle =
            'This is a very long title that exceeds the maximum length of 80 characters for testing purposes';
        render(
            <Components.PublicationCard
                publicationVersion={{ ...TestUtils.testPublicationVersion, title: longTitle }}
            />
        );
        expect(screen.getByText(Helpers.truncateString(longTitle, 69))).toBeInTheDocument();
    });
    it('"et al." is shown after main author name if there are multiple authors', () => {
        render(
            <Components.PublicationCard
                publicationVersion={{
                    ...TestUtils.testPublicationVersion,
                    coAuthors: [
                        ...TestUtils.testPublicationVersion.coAuthors,
                        {
                            id: 'test-coauthor-2',
                            confirmedCoAuthor: true,
                            approvalRequested: true,
                            email: 'test-coauthor-email@mailinator.com',
                            publicationVersionId: TestUtils.testPublicationVersion.id,
                            linkedUser: 'test-2',
                            affiliations: [],
                            isIndependent: true,
                            user: {
                                firstName: 'Test',
                                lastName: 'User',
                                role: 'USER',
                                orcid: '0000-0002-1234-5678'
                            }
                        }
                    ]
                }}
            />
        );
        expect(
            screen.getByText(`${Helpers.abbreviateUserName(TestUtils.testPublicationVersion.coAuthors[0].user)} et al.`)
        ).toBeInTheDocument();
    });
});
