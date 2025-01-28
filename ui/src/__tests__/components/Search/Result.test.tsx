import * as Components from '@/components';

import { render, screen } from '@testing-library/react';

describe('Search result', () => {
    beforeEach(() => {
        render(
            <Components.SearchResult linkDestination="/publications/my-publication">
                <p>Search result</p>
            </Components.SearchResult>
        );
    });

    it('Search result is a link to the provided link destination', () => {
        expect(screen.getByRole('link')).toHaveAttribute('href', '/publications/my-publication');
    });

    it('Search result contains children', () => {
        expect(screen.getByText('Search result')).toBeInTheDocument();
    });
});
