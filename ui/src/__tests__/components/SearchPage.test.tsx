import * as Components from '@/components';
import * as TestUtils from '@/testUtils';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

jest.mock('next/router', () => ({
    useRouter: jest.fn()
}));

describe('Basic search page', () => {
    const handleSearchFormSubmit = jest.fn((e) => {
        e.preventDefault();
    });
    const setLimit = jest.fn();

    beforeEach(() => {
        render(
            <Components.SearchPage
                handleSearchFormSubmit={handleSearchFormSubmit}
                isValidating={false}
                limit={10}
                offset={0}
                query={null}
                results={[]}
                searchType="publication-versions"
                setLimit={setLimit}
                setOffset={jest.fn}
                total={0}
            />
        );
    });

    it('Title is as expected', () => {
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Search results');
    });

    it('Search type select is not present', () => {
        expect(screen.queryByRole('combobox', { name: 'Searching' })).not.toBeInTheDocument();
    });

    it('Page size select is present', () => {
        expect(screen.getByRole('combobox', { name: 'Showing' })).toBeInTheDocument();
    });

    it('Page size select has expected options', () => {
        const pageSizeSelect = screen.getByRole('combobox', { name: 'Showing' });
        expect(pageSizeSelect).toContainElement(screen.getByRole('option', { name: '5' }));
        expect(pageSizeSelect).toContainElement(screen.getByRole('option', { name: '10' }));
        expect(pageSizeSelect).toContainElement(screen.getByRole('option', { name: '15' }));
        expect(pageSizeSelect).toContainElement(screen.getByRole('option', { name: '20' }));
        expect(pageSizeSelect).toContainElement(screen.getByRole('option', { name: '50' }));
        expect(pageSizeSelect.children).toHaveLength(5);
    });

    it('Page size select has value set by limit prop', () => {
        expect(screen.getByRole('combobox', { name: 'Showing' })).toHaveValue('10');
    });

    it('Changing page size select calls setLimit', async () => {
        await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Showing' }), '15');
        expect(setLimit).toHaveBeenCalledWith(15);
    });

    it('Query input is present', () => {
        expect(screen.getByRole('textbox', { name: 'Quick search' })).toBeInTheDocument();
    });

    it('Query input has expected placeholder', () => {
        expect(screen.getByRole('textbox', { name: 'Quick search' })).toHaveAttribute(
            'placeholder',
            'Type here and press enter...'
        );
    });

    it('Search submit button is present', () => {
        expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    });

    it('Submitting search form calls handleSearchFormSubmit', async () => {
        await userEvent.click(screen.getByRole('button', { name: 'Search' }));
        expect(handleSearchFormSubmit).toHaveBeenCalled();
    });

    it('Clear filters button is not present', () => {
        expect(screen.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument();
    });

    it('No results message is shown', () => {
        expect(screen.getByText('No results found')).toBeInTheDocument();
        expect(screen.getByText('Try some different search criteria.')).toBeInTheDocument();
        expect(screen.getByText('If you think something is wrong, please contact the helpdesk.')).toBeInTheDocument();
    });
});

describe('Search page with search type select', () => {
    const handleSearchFormSubmit = jest.fn((e) => {
        e.preventDefault();
    });
    const setLimit = jest.fn();

    beforeEach(() => {
        render(
            <Components.SearchPage
                handleSearchFormSubmit={handleSearchFormSubmit}
                isValidating={false}
                limit={10}
                offset={0}
                query={null}
                results={[]}
                searchType="publication-versions"
                setLimit={setLimit}
                setOffset={jest.fn}
                showSearchTypeSwitch={true}
                total={0}
            />
        );
    });

    it('Search type select is present', () => {
        expect(screen.getByRole('combobox', { name: 'Searching' })).toBeInTheDocument();
    });

    it('Search type select has expected options', () => {
        const searchTypeSelect = screen.getByRole('combobox', { name: 'Searching' });
        expect(searchTypeSelect).toContainElement(screen.getByRole('option', { name: 'Publications' }));
        expect(searchTypeSelect).toContainElement(screen.getByRole('option', { name: 'Authors' }));
        expect(searchTypeSelect).toContainElement(screen.getByRole('option', { name: 'Topics' }));
        expect(searchTypeSelect).toContainElement(screen.getByRole('option', { name: 'Organisations' }));
        expect(searchTypeSelect.children).toHaveLength(4);
    });

    it('Search type select has value "publications"', () => {
        expect(screen.getByRole('combobox', { name: 'Searching' })).toHaveValue('publications');
    });

    // TODO: test that changing search type select calls useRouter's push with the appropriate path.
    // Couldn't get this to work.
});

describe('Search page with filters', () => {
    const resetFilters = jest.fn();

    beforeEach(() => {
        render(
            <Components.SearchPage
                filters={<p>React node holding the place of some filter JSX</p>}
                handleSearchFormSubmit={jest.fn}
                isValidating={false}
                limit={10}
                offset={0}
                query={null}
                resetFilters={resetFilters}
                results={[]}
                searchType="publication-versions"
                setLimit={jest.fn}
                setOffset={jest.fn}
                total={0}
            />
        );
    });

    it('Filters are shown', () => {
        expect(screen.getByText('React node holding the place of some filter JSX')).toBeInTheDocument();
    });

    it('Clear filters button is present', () => {
        expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument();
    });

    it('Clear filters button triggers resetFilters function', async () => {
        await userEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
        expect(resetFilters).toHaveBeenCalled();
    });
});

describe('First page of several results', () => {
    const setOffset = jest.fn();
    global.scrollTo = jest.fn();
    beforeEach(() => {
        render(
            <Components.SearchPage
                handleSearchFormSubmit={jest.fn}
                isValidating={false}
                limit={10}
                offset={0}
                query={null}
                results={[...Array(10).keys()].map((idx) => ({
                    ...TestUtils.testPublicationVersion,
                    versionOf: 'test-publication-' + idx,
                    title: 'Test publication ' + idx
                }))}
                searchType="publication-versions"
                setLimit={jest.fn}
                setOffset={setOffset}
                total={100}
            />
        );
    });

    it('Results are shown', () => {
        Array(10)
            .map((idx) => 'Test publication ' + idx)
            .forEach((title) => {
                expect(screen.getByText(title)).toBeInTheDocument();
            });
    });

    it('Results are publication links', async () => {
        expect(screen.getByRole('link', { name: /Test publication 0/ })).toHaveAttribute(
            'href',
            '/publications/test-publication-0'
        );
    });

    // Pagination
    it('Pagination status is shown', () => {
        expect(screen.getByText('Showing 1 - 10 of 100')).toBeInTheDocument();
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

describe('Last page of several results', () => {
    const setOffset = jest.fn();
    global.scrollTo = jest.fn();
    beforeEach(() => {
        render(
            <Components.SearchPage
                handleSearchFormSubmit={jest.fn}
                isValidating={false}
                limit={10}
                offset={90}
                query={null}
                results={[...Array(9).keys()].map((idx) => ({
                    ...TestUtils.testPublicationVersion,
                    versionOf: 'test-publication-' + idx,
                    title: 'Test publication ' + idx
                }))}
                searchType="publication-versions"
                setLimit={jest.fn}
                setOffset={setOffset}
                total={99}
            />
        );
    });

    it('Pagination status is shown', () => {
        expect(screen.getByText('Showing 91 - 99 of 99', {})).toBeInTheDocument();
    });

    it('Previous button is shown', () => {
        expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
    });

    it('Previous button is enabled when not on first page', () => {
        expect(screen.getByRole('button', { name: 'Previous' })).toBeEnabled();
    });

    it('Previous button calls setOffset with previous page offset', async () => {
        await userEvent.click(screen.getByRole('button', { name: 'Previous' }));
        expect(setOffset).toHaveBeenCalledWith(80);
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
        <Components.SearchPage
            error="Something went wrong"
            handleSearchFormSubmit={jest.fn}
            isValidating={false}
            limit={10}
            offset={0}
            query={null}
            results={[]}
            searchType="publication-versions"
            setLimit={jest.fn}
            setOffset={jest.fn}
            total={0}
        />
    );
    // Error is written to alert box and aria-live area.
    expect(screen.getAllByText('Something went wrong')).toHaveLength(2);
});

it('Results are author page links when searchType is "authors"', () => {
    render(
        <Components.SearchPage
            handleSearchFormSubmit={jest.fn}
            isValidating={false}
            limit={10}
            offset={0}
            query={null}
            results={[
                {
                    ...TestUtils.testUser,
                    id: 'test-author-0',
                    firstName: 'Test author 0'
                }
            ]}
            searchType="authors"
            setLimit={jest.fn}
            setOffset={jest.fn}
            total={100}
        />
    );
    expect(screen.getByRole('link', { name: /Test author 0/ })).toHaveAttribute('href', '/authors/test-author-0');
});

it('Results are author page links when searchType is "organisations"', () => {
    render(
        <Components.SearchPage
            handleSearchFormSubmit={jest.fn}
            isValidating={false}
            limit={10}
            offset={0}
            query={null}
            results={[
                {
                    ...TestUtils.testUser,
                    id: 'test-org-0',
                    firstName: 'Test org 0'
                }
            ]}
            searchType="organisations"
            setLimit={jest.fn}
            setOffset={jest.fn}
            total={100}
        />
    );
    expect(screen.getByRole('link', { name: /Test org 0/ })).toHaveAttribute('href', '/authors/test-org-0');
});

it('Results are topic page links when searchType is "topics"', () => {
    render(
        <Components.SearchPage
            handleSearchFormSubmit={jest.fn}
            isValidating={false}
            limit={10}
            offset={0}
            query={null}
            results={[
                {
                    id: 'test-topic-0',
                    title: 'Test topic 0',
                    createdAt: Date.now().toLocaleString()
                }
            ]}
            searchType="topics"
            setLimit={jest.fn}
            setOffset={jest.fn}
            total={100}
        />
    );
    expect(screen.getByRole('link', { name: 'Test topic 0' })).toHaveAttribute('href', '/topics/test-topic-0');
});
