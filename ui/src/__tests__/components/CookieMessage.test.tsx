import * as Components from '@/components';
import * as Config from '@/config';
import { render, screen } from '@testing-library/react';

describe('Cookie message', () => {
    beforeEach(() => {
        render(<Components.CookieMessage />);
    });
    it('Contains link to cookie policy', () => {
        expect(screen.getByRole('link')).toHaveAttribute('href', Config.urls.cookiePolicy.path);
    });
    it('Contains dismiss button', () => {
        expect(screen.getByRole('button')).toHaveTextContent('Dismiss');
        // TODO: can't work out how to mock zustand and check that the toggle function from the preferencesStore is called.
    });
});
