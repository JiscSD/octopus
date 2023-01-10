import * as Components from '@components';
import { render, screen, fireEvent } from '@testing-library/react';

describe('CoAuthor tests', () => {
    const component = <Components.PublicationCreationCoAuthor />;

    beforeEach(() => {
        render(component);
    });

    it('CoAuthor invite renders without crashing', () => {
        expect(screen.getByTestId('co-author-invite')).toBeInTheDocument();
    });

    it('Send CoAuthor invite is disabled when input field is blank', () => {
        expect(screen.getByTitle('Send co-author invite')).toBeDisabled();
    });

    it('Send CoAuthor invite is enabled when input field is has entry', () => {
        const emailInput = screen.getByTestId('co-author-email-input');
        fireEvent.change(emailInput, { target: { value: 'email@example.com' } });
        expect(screen.getByTitle('Send co-author invite')).toBeEnabled();
    });

    it('Error alert is not rendered initially', () => {
        expect(screen.queryByTestId('alert-box')).not.toBeInTheDocument();
    });

    it('Error alert appears when invalid email is entered into input field', () => {
        const emailInput = screen.getByTestId('co-author-email-input');
        const sendInviteButton = screen.getByTitle('Send co-author invite');
        fireEvent.change(emailInput, { target: { value: 'invalidemail.com' } });
        fireEvent.click(sendInviteButton);
        expect(screen.getByTestId('alert-box')).toBeInTheDocument();
    });

    it('Alert is removed on invalid email when input is changed', () => {
        const emailInput = screen.getByTestId('co-author-email-input');
        const sendInviteButton = screen.getByTitle('Send co-author invite');
        fireEvent.change(emailInput, { target: { value: 'invalidemail.com' } });
        fireEvent.click(sendInviteButton);
        expect(screen.getByTestId('alert-box')).toBeInTheDocument();

        fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
        expect(screen.queryByTestId('alert-box')).not.toBeInTheDocument();
    });

    it('Input field is empty on valid email submission', () => {
        const emailInput = screen.getByTestId('co-author-email-input');
        const sendInviteButton = screen.getByTitle('Send co-author invite');
        fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
        fireEvent.click(sendInviteButton);
        expect(emailInput.textContent).toBe('');
    });
});
