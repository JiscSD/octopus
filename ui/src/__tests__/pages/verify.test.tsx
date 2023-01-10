import Verify from '../../pages/verify';

import { render, screen, fireEvent } from '@testing-library/react';

// https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
    }))
});

describe('Verify email tests', () => {
    beforeEach(() => {
        const useRouter = jest.spyOn(require('next/router'), 'useRouter');

        useRouter.mockImplementation(() => ({
            route: '/',
            pathname: '',
            query: '',
            asPath: '',
            push: jest.fn(),
            events: {
                on: jest.fn(),
                off: jest.fn()
            },
            beforePopState: jest.fn(() => null),
            prefetch: jest.fn(() => null)
        }));

        render(<Verify newUser={false} redirectTo="https://localhost:3001" />);
    });

    it('Verify email renders without crashing', () => {
        expect(screen.getByTestId('update-email-form')).toBeInTheDocument();
    });

    it('Send code is disabled when input field is blank', () => {
        expect(screen.getByTitle('Send code')).toBeDisabled();
    });

    it('Send code invite is enabled when input field is has entry', () => {
        const emailInput = screen.getByTestId('verify-email-input');
        fireEvent.change(emailInput, { target: { value: 'email@example.com' } });
        expect(screen.getByTitle('Send code')).toBeEnabled();
    });

    it('Error alert is not rendered initially', () => {
        expect(screen.queryByTestId('alert-box')).not.toBeInTheDocument();
    });

    it('Error alert appears when invalid email is entered into input field', () => {
        const emailInput = screen.getByTestId('verify-email-input');
        const sendInviteButton = screen.getByTitle('Send code');
        fireEvent.change(emailInput, { target: { value: 'invalidemail.com' } });
        fireEvent.click(sendInviteButton);
        expect(screen.getByTestId('alert-box')).toBeInTheDocument();
    });

    it('Alert is removed on invalid email when input is changed', () => {
        const emailInput = screen.getByTestId('verify-email-input');
        const sendInviteButton = screen.getByTitle('Send code');
        fireEvent.change(emailInput, { target: { value: 'invalidemail.com' } });
        fireEvent.click(sendInviteButton);
        expect(screen.getByTestId('alert-box')).toBeInTheDocument();

        fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
        expect(screen.queryByTestId('alert-box')).not.toBeInTheDocument();
    });
});
