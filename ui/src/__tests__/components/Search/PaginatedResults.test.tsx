import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import * as Components from '@/components';

describe('With no results', () => {
    beforeEach(() => {
        render(
            <Components.PaginatedResults
                isValidating={false}
                limit={10}
                offset={0}
                results={[]}
                setOffset={jest.fn}
                total={0}
            />
        );
    });

    it('No results message is shown', () => {
        expect(screen.getByText('No results found')).toBeInTheDocument();
        expect(screen.getByText('Try some different search criteria.')).toBeInTheDocument();
        expect(screen.getByText('If you think something is wrong, please contact the helpdesk.')).toBeInTheDocument();
    });
});

describe('With results', () => {
    const setOffset = jest.fn();
    global.scrollTo = jest.fn();
    beforeEach(() => {
        render(
            <Components.PaginatedResults
                isValidating={false}
                limit={10}
                offset={0}
                results={<p>Placeholder</p>}
                setOffset={setOffset}
                total={50}
            />
        );
    });

    it('Pagination status is shown', () => {
        expect(screen.getByText('Showing 1 - 10 of 50')).toBeInTheDocument();
    });

    it('Previous button is shown', () => {
        expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
    });

    it('Previous button is disabled on first page', () => {
        expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    });

    it('Next button is shown', () => {
        expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    });

    it('Next button is enabled when not on last page', () => {
        expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
    });

    it('Next button calls setOffset with next page offset', async () => {
        await userEvent.click(screen.getByRole('button', { name: 'Next' }));
        expect(setOffset).toHaveBeenCalledWith(10);
    });
});

describe('Last page of results', () => {
    const setOffset = jest.fn();
    global.scrollTo = jest.fn();
    beforeEach(() => {
        render(
            <Components.PaginatedResults
                isValidating={false}
                limit={10}
                offset={40}
                results={<p>Placeholder</p>}
                setOffset={setOffset}
                total={50}
            />
        );
    });

    it('Pagination status is shown', () => {
        expect(screen.getByText('Showing 41 - 50 of 50')).toBeInTheDocument();
    });

    it('Previous button is shown', () => {
        expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
    });

    it('Previous button is enabled when not on first page', () => {
        expect(screen.getByRole('button', { name: 'Previous' })).toBeEnabled();
    });

    it('Previous button calls setOffset with previous page offset', async () => {
        await userEvent.click(screen.getByRole('button', { name: 'Previous' }));
        expect(setOffset).toHaveBeenCalledWith(30);
    });

    it('Next button is shown', () => {
        expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    });

    it('Next button is disabled when not on last page', () => {
        expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    });
});

it('Error is shown when passed', () => {
    render(
        <Components.PaginatedResults
            error="Something went wrong"
            isValidating={false}
            limit={10}
            offset={0}
            results={[]}
            setOffset={jest.fn}
            total={0}
        />
    );
    // Error is written to alert box and aria-live area.
    expect(screen.getAllByText('Something went wrong')).toHaveLength(2);
});

it('Custom no results message is shown', () => {
    render(
        <Components.PaginatedResults
            isValidating={false}
            limit={10}
            noResultsMessage="Results are not present. Panic!"
            offset={0}
            results={[]}
            setOffset={jest.fn}
            total={0}
        />
    );
    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(screen.getByText('Results are not present. Panic!')).toBeInTheDocument();
});
