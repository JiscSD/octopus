import * as Components from '@/components';

import { render, screen } from '@testing-library/react';

describe('Additional Information Card', () => {
    beforeEach(() => {
        render(
            <Components.AdditionalInformationCard
                additionalInformation={{
                    title: 'Some data somewhere else',
                    url: 'https://example.com',
                    description: 'This data clarifies part of the publication'
                }}
                publicationLanguage="fr"
            />
        );
    });

    it('Displays title', () => {
        expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Some data somewhere else');
    });

    it('Displays description', () => {
        expect(screen.getByText('This data clarifies part of the publication')).toBeInTheDocument();
    });

    it('Displays link to url', () => {
        expect(screen.getByRole('link', { name: 'Some data somewhere else' })).toHaveAttribute(
            'href',
            'https://example.com'
        );
    });

    it('Marked up with language', () => {
        expect(screen.getByTestId('additional-information-card')).toHaveAttribute('lang', 'fr');
    });
});
