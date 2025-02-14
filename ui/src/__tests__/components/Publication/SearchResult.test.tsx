import * as Components from '@/components';
import * as Helpers from '@/helpers';

import { render, screen } from '@testing-library/react';

// Ensure it is over 370 characters long so we can check truncation.
const content = `<h3>Heading</h3><p>${'Text. '.repeat(100)}</p>`;

describe('Publication search result', () => {
    const description = 'A description of the publication.';
    const prefaceText = 'Some introductory information pertaining to this result.';
    const publishedDate = new Date().toISOString();
    beforeEach(() => {
        render(
            <Components.PublicationSearchResult
                coAuthors={[
                    { user: { firstName: 'Example', lastName: 'User' } },
                    { user: { firstName: 'Another', lastName: 'One' } }
                ]}
                content={content}
                description={description}
                preface={<p>{prefaceText}</p>}
                publicationId="test"
                publishedDate={publishedDate}
                title="Test publication"
                type="PROBLEM"
            />
        );
    });

    it('Search result is a link to the publication', () => {
        expect(screen.getByRole('link')).toHaveAttribute('href', '/publications/test');
    });

    it('Shows preface', () => {
        expect(screen.getByText(prefaceText)).toBeInTheDocument();
    });

    it('Shows publication type', () => {
        expect(screen.getByText(Helpers.formatPublicationType('PROBLEM'))).toBeInTheDocument();
    });

    it('Shows title', () => {
        expect(screen.getByText('Test publication')).toBeInTheDocument();
    });

    it('Shows description rather than content', () => {
        expect(screen.getByText(description)).toBeInTheDocument();
        expect(screen.queryByText(Helpers.truncateString(Helpers.htmlToText(content), 370))).not.toBeInTheDocument();
    });

    it('Shows pubished date with author list', () => {
        expect(
            screen.getByText(`Published ${Helpers.formatDate(publishedDate)}, by E. User, A. One`)
        ).toBeInTheDocument();
    });
});

it('Content is shown if description is not available', () => {
    render(
        <Components.PublicationSearchResult
            coAuthors={[]}
            content={content}
            description={null}
            publicationId="test"
            publishedDate={new Date().toISOString()}
            title="Test publication"
            type="PROBLEM"
        />
    );
    const truncatedContent = Helpers.truncateString(Helpers.htmlToText(content), 370);
    expect(screen.getByText(truncatedContent)).toBeInTheDocument();
});

it('Result links to custom link destination if provided', () => {
    const linkDestination = '/publication/test/flags/myflag';
    render(
        <Components.PublicationSearchResult
            coAuthors={[]}
            content={null}
            description={null}
            linkDestination={linkDestination}
            publicationId="test"
            publishedDate={new Date().toISOString()}
            title="Test publication"
            type="PROBLEM"
        />
    );
    expect(screen.getByRole('link')).toHaveAttribute('href', linkDestination);
});
