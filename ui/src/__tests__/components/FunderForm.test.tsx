import * as mocks from '@/mocks';
import * as Components from '@/components';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

describe('Funder form tests', () => {
    const component = <Components.FunderForm />;

    beforeEach(() => {
        render(component);
    });

    it('Fields are enabled or disabled based on funder method', async () => {
        const rorId = screen.getByTitle('ROR ID');
        const grantIdFields = screen.getAllByPlaceholderText('Grant Identifier');
        const name = screen.getByPlaceholderText('Name*');
        const city = screen.getByPlaceholderText('City*');
        const country = screen.getByPlaceholderText('Country');
        const link = screen.getByPlaceholderText('Link*');
        expect(rorId).toBeEnabled();
        expect(grantIdFields[0]).toBeEnabled();
        expect(name).toBeDisabled();
        expect(city).toBeDisabled();
        expect(country).toBeDisabled();
        expect(link).toBeDisabled();
        expect(grantIdFields[1]).toBeDisabled();
        userEvent.click(screen.getByLabelText("Enter the organisation's details manually"));
        await waitFor(() => {
            expect(rorId).toBeDisabled();
            expect(grantIdFields[0]).toBeDisabled();
            expect(name).toBeEnabled();
            expect(city).toBeEnabled();
            expect(country).toBeEnabled();
            expect(link).toBeEnabled();
            expect(grantIdFields[1]).toBeEnabled();
        });
    });

    it('Add funder button is enabled when ROR details have been entered', async () => {
        mocks.mockedAxios.get.mockResolvedValueOnce({
            data: {
                name: 'Jisc',
                addresses: [
                    {
                        city: 'Bristol'
                    }
                ],
                links: ['https://jisc.ac.uk'],
                country: {
                    country_name: 'United Kingdom'
                }
            }
        });

        const addRorFunderButton = screen.getAllByTitle('Add funder')[0];
        expect(addRorFunderButton).toBeDisabled();
        userEvent.click(screen.getByTitle('ROR ID'));
        userEvent.keyboard('01rv9gx86');
        await screen.findByLabelText('Valid ror ID');
        expect(addRorFunderButton).toBeEnabled();
    });

    it('Add funder button is enabled when manual details have been entered', async () => {
        userEvent.click(screen.getByLabelText("Enter the organisation's details manually"));
        await waitFor(() => expect(screen.getByTitle('ROR ID')).toBeDisabled());
        const addManualFunderButton = screen.getAllByTitle('Add funder')[1];
        expect(addManualFunderButton).toBeDisabled();
        userEvent.click(screen.getByPlaceholderText('Name*'));
        userEvent.keyboard('Test name');
        expect(addManualFunderButton).toBeDisabled();
        userEvent.click(screen.getByPlaceholderText('City*'));
        userEvent.keyboard('Test city');
        expect(addManualFunderButton).toBeDisabled();
        userEvent.click(screen.getByPlaceholderText('Link*'));
        userEvent.keyboard('https://test.com');
        await waitFor(() => expect(addManualFunderButton).toBeEnabled());
    });

    it('Link validation error shows and hides appropriately', async () => {
        const linkErrorText = 'Please enter a valid URL starting with "http".';
        userEvent.click(screen.getByLabelText("Enter the organisation's details manually"));
        await waitFor(() => expect(screen.getByTitle('ROR ID')).toBeDisabled());
        userEvent.click(screen.getByPlaceholderText('Name*'));
        userEvent.keyboard('Test name');
        userEvent.click(screen.getByPlaceholderText('City*'));
        userEvent.keyboard('Test city');
        userEvent.click(screen.getByPlaceholderText('Link*'));
        userEvent.keyboard('invalid link');
        expect(screen.queryByText(linkErrorText)).not.toBeInTheDocument();
        // Submit with invalid link value
        userEvent.click(screen.getAllByTitle('Add funder')[1]);
        await waitFor(() => expect(screen.getByText(linkErrorText)).toBeInTheDocument());
        // Edit field again and expect error to go away
        userEvent.click(screen.getByPlaceholderText('Link*'));
        userEvent.keyboard('a');
        await waitFor(() => expect(screen.queryByText(linkErrorText)).not.toBeInTheDocument());
    });
});
