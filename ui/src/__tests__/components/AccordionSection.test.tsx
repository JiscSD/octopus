import * as Components from '@/components';

import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

describe('Accordion section', () => {
    beforeEach(() => {
        render(
            <Components.AccordionSection id="accordion" title="Publication details">
                <p>This publication is good.</p>
            </Components.AccordionSection>
        );
    });

    it('Accordion has toggle button', () => {
        expect(screen.getByRole('button', { name: 'Publication details' })).toBeInTheDocument();
    });

    it('Accordion is open by default', () => {
        expect(screen.getByRole('region')).toBeInTheDocument();
        expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    });

    it('Hitting button toggles contents', async () => {
        global.scrollTo = jest.fn();
        await userEvent.click(screen.getByRole('button'));
        await waitFor(() => {
            expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
            expect(screen.queryByRole('region')).not.toBeInTheDocument();
        });
        await userEvent.click(screen.getByRole('button'));
        await waitFor(() => {
            expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
            expect(screen.getByRole('region')).toBeInTheDocument();
        });
    });
});
