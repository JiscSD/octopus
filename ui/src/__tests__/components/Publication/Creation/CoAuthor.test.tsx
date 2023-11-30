import * as Components from '@components';
import { render, screen, fireEvent, within } from '@testing-library/react';

describe('CoAuthor tests', () => {
    const component = <Components.PublicationCreationCoAuthor />;

    beforeEach(() => {
        render(component);
    });

    it('CoAuthor invite renders without crashing', () => {
        expect(screen.getByTestId('co-author-invite')).toBeInTheDocument();
    });

    it('Send CoAuthor invite is disabled when input field is blank', () => {
        expect(screen.getByTitle('Add Co-author')).toBeDisabled();
    });

    it('Send CoAuthor invite is enabled when input field is has entry', () => {
        const emailInput = screen.getByTestId('co-author-email-input');
        fireEvent.change(emailInput, { target: { value: 'email@example.com' } });
        expect(screen.getByTitle('Add Co-author')).toBeEnabled();
    });

    it('Error alert is not rendered initially', () => {
        expect(screen.queryByTestId('alert-box')).not.toBeInTheDocument();
    });

    it('Error alert appears when invalid email is entered into input field', () => {
        const emailInput = screen.getByTestId('co-author-email-input');
        const sendInviteButton = screen.getByTitle('Add Co-author');
        fireEvent.change(emailInput, { target: { value: 'invalidemail.com' } });
        fireEvent.click(sendInviteButton);
        expect(screen.getByTestId('alert-box')).toBeInTheDocument();
    });

    it('Alert is removed on invalid email when input is changed', () => {
        const emailInput = screen.getByTestId('co-author-email-input');
        const sendInviteButton = screen.getByTitle('Add Co-author');
        fireEvent.change(emailInput, { target: { value: 'invalidemail.com' } });
        fireEvent.click(sendInviteButton);
        expect(screen.getByTestId('alert-box')).toBeInTheDocument();

        fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
        expect(screen.queryByTestId('alert-box')).not.toBeInTheDocument();
    });

    it('Input field is empty on valid email submission', () => {
        const emailInput = screen.getByTestId('co-author-email-input');
        const sendInviteButton = screen.getByTitle('Add Co-author');
        fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
        fireEvent.click(sendInviteButton);
        expect(emailInput.textContent).toBe('');
    });

    it('Prevent duplicate email from being added to co-author table', () => {
        const emailInput = screen.getByTestId('co-author-email-input');
        const sendInviteButton = screen.getByTitle('Add Co-author');
        fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
        fireEvent.click(sendInviteButton);

        fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
        fireEvent.click(sendInviteButton);

        expect(screen.getAllByTestId('alert-box')[1]).toBeInTheDocument();
    });

    it('Valid email is added to table', () => {
        expect(screen.getAllByRole('row')[1]).toHaveTextContent('valid@email.com');
    });

    it('Delete email from table', () => {
        fireEvent.click(within(screen.getAllByRole('row')[1]).getByTitle('Delete'));
        expect(screen.getAllByRole('row')).toHaveLength(1);
    });
});
