import * as Components from '@/components';
import { within } from '@testing-library/dom';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

describe('Alert component', () => {
    const title = 'Watch out!';
    const supportLink = {
        text: 'Go here for support',
        url: 'https://jisc.ac.uk',
        external: true
    };

    it('Alert shows supplied title', () => {
        render(<Components.Alert title={title} severity="ERROR" />);
        expect(screen.getByText(title)).toBeInTheDocument();
    });

    it('Alert shows supplied support link', () => {
        render(<Components.Alert supportLink={supportLink} severity="ERROR" />);
        const link = screen.getByRole('link', {});
        expect(link).toBeInTheDocument();
        expect(within(link).getByText(supportLink.text)).toBeInTheDocument();
    });

    it('Dismiss button is not shown by default', () => {
        render(<Components.Alert severity="ERROR" />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('Alert shows dismiss button if allowed', () => {
        render(<Components.Alert severity="ERROR" allowDismiss={true} />);
        expect(screen.getByRole('button')).toHaveTextContent('Dismiss');
    });

    it('Dismiss button has accessible description', () => {
        render(<Components.Alert severity="ERROR" allowDismiss={true} />);
        expect(screen.getByLabelText('Dismiss alert')).toBeInTheDocument();
    });

    it('Alert can be dismissed', async () => {
        render(<Components.Alert severity="ERROR" allowDismiss={true} />);
        userEvent.click(screen.getByRole('button'));
        await waitFor(() => expect(screen.queryByTestId('alert-box')).not.toBeInTheDocument());
    });
});
