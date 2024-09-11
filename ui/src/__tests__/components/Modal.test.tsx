import '@testing-library/jest-dom';

import * as Components from '@/components';

import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

const handleOnClose = jest.fn();
const handlePositiveActionCallBack = jest.fn();
const title = 'Test Modal';
const childText = 'Child';
const positiveButtonText = 'Save';
const negativeButtonDefaultText = 'Close';
const inputLabelText = 'First Name';

window.ResizeObserver = jest.fn().mockImplementation(() => ({
    disconnect: jest.fn(),
    observe: jest.fn(),
    unobserve: jest.fn()
}));

describe('Basic modal', () => {
    beforeEach(() => {
        render(
            <Components.Modal title={title} open={true} onClose={handleOnClose}>
                <p>{childText}</p>
                <input name="firstname" aria-label={inputLabelText} />
            </Components.Modal>
        );
    });

    it('Modal has dialog role', () => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('Title is shown', () => {
        expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(title);
    });

    it('Child is rendered', () => {
        expect(screen.getByText(childText)).toBeInTheDocument();
    });

    it('Only close button is shown', () => {
        expect(screen.getByRole('button')).toHaveAccessibleDescription('Close');
    });

    it('Close button triggers onClose function', async () => {
        userEvent.click(screen.getByRole('button'));
        await waitFor(() => expect(handleOnClose).toHaveBeenCalledTimes(1));
    });

    it('First focusable element in children has focus', () => {
        expect(screen.getByLabelText(inputLabelText)).toHaveFocus();
    });
});

describe('Loading modal', () => {
    beforeEach(() => {
        render(
            <Components.Modal
                title={title}
                open={true}
                onClose={handleOnClose}
                loading={true}
                positiveCallback={handlePositiveActionCallBack}
                positiveButtonText={positiveButtonText}
            >
                <p>{childText}</p>
            </Components.Modal>
        );
    });

    it('Loading bar is shown', () => {
        expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    });

    it('Buttons are disabled when loading', () => {
        expect(screen.getByRole('button', { name: positiveButtonText })).toBeDisabled();
        expect(screen.getByRole('button', { name: negativeButtonDefaultText })).toBeDisabled();
    });
});

describe('One off cases', () => {
    it('Closed modal is empty element', () => {
        const { container } = render(
            <Components.Modal title={title} open={false} onClose={handleOnClose}>
                <p>{childText}</p>
            </Components.Modal>
        );
        expect(container).toBeEmptyDOMElement();
    });

    it('Cancel button displays custom text when provided', () => {
        const customCancelText = 'Shut Modal';
        render(
            <Components.Modal title={title} open={true} onClose={handleOnClose} cancelButtonText={customCancelText}>
                <p>{childText}</p>
            </Components.Modal>
        );
        expect(screen.getByRole('button', { name: customCancelText })).toBeInTheDocument();
    });

    it('Subtitle is rendered when provided', () => {
        const subtitle = 'Interact with this modal please';
        render(<Components.Modal title={title} open={true} onClose={handleOnClose} subtitle={subtitle} />);
        expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(subtitle);
    });

    it('Positive button triggers positive action when provided', async () => {
        render(
            <Components.Modal
                title={title}
                open={true}
                onClose={handleOnClose}
                positiveCallback={handlePositiveActionCallBack}
                positiveButtonText={positiveButtonText}
            />
        );
        userEvent.click(screen.getByRole('button', { name: positiveButtonText }));
        await waitFor(() => expect(handlePositiveActionCallBack).toHaveBeenCalledTimes(1));
    });
});
