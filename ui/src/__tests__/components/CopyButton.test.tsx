import * as Components from '@/components';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

Object.assign(navigator, {
    clipboard: {
        writeText: jest.fn(() => Promise.resolve())
    }
});

describe('CopyButton', () => {
    const buttonTitle = 'Copy some text';
    const textToCopy = 'Test value';

    beforeEach(() => {
        render(<Components.CopyButton textToCopy={textToCopy} title={buttonTitle} />);
    });

    it('Button is present', () => {
        expect(screen.getByRole('button', { name: buttonTitle })).toBeInTheDocument();
    });

    it('Clicking the button copies the text to the clipboard', async () => {
        await userEvent.click(screen.getByRole('button', { name: buttonTitle }));
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(textToCopy);
    });

    it('Clicking the button updates the aria-live message', async () => {
        expect(screen.queryByText('Copied!')).not.toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: buttonTitle }));
        expect(screen.getByText('Copied!')).toBeInTheDocument();
        expect(screen.getByText('Copied!')).toHaveAttribute('aria-live', 'polite');
    });
});
