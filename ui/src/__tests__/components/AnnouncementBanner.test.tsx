import * as Components from '@/components';
import { render, screen } from '@testing-library/react';

describe('Announcement banner', () => {
    beforeEach(() => {
        render(<Components.AnnouncementBanner>Placholder message</Components.AnnouncementBanner>);
    });
    it('Contains dismiss button', () => {
        expect(screen.getByRole('button')).toHaveTextContent('Dismiss');
        // TODO: can't work out how to mock zustand and check that the toggle function from the preferencesStore is called when this button is clicked.
    });
});
