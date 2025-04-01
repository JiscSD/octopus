import * as Components from '@/components';
import * as TestUtils from '@/testUtils';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

jest.mock('next/router', () => ({
    useRouter: jest.fn()
}));

describe('Basic search interface', () => {
    const handleSearchFormSubmit = jest.fn((e) => {
        e.preventDefault();
    });
    const setLimit = jest.fn();

    beforeEach(() => {
        render(
            <Components.SearchInterface
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

    // Negative test for absence of full screen prop.
    it('Results area does not have min-h-screen class', () => {
        expect(screen.getByRole('article')).not.toHaveClass('min-h-screen');
    });
});

describe('Search interface with search type select', () => {
    const handleSearchFormSubmit = jest.fn((e) => {
        e.preventDefault();
    });
    const setLimit = jest.fn();

    beforeEach(() => {
        render(
            <Components.SearchInterface
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

describe('Search interface with filters', () => {
    const resetFilters = jest.fn();

    beforeEach(() => {
        render(
            <Components.SearchInterface
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

describe('Interface with results', () => {
    const setOffset = jest.fn();
    global.scrollTo = jest.fn();
    beforeEach(() => {
        render(
            <Components.SearchInterface
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
});

it('Results are author page links when searchType is "authors"', () => {
    render(
        <Components.SearchInterface
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
        <Components.SearchInterface
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
        <Components.SearchInterface
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

it('Page size options are configurable', () => {
    render(
        <Components.SearchInterface
            handleSearchFormSubmit={jest.fn}
            isValidating={false}
            limit={10}
            offset={0}
            pageSizes={[1, 7, 27, 2109845]}
            query={null}
            results={[]}
            searchType="publication-versions"
            setLimit={jest.fn}
            setOffset={jest.fn}
            total={0}
        />
    );
    const pageSizeSelect = screen.getByRole('combobox', { name: 'Showing' });
    expect(pageSizeSelect).toContainElement(screen.getByRole('option', { name: '1' }));
    expect(pageSizeSelect).toContainElement(screen.getByRole('option', { name: '7' }));
    expect(pageSizeSelect).toContainElement(screen.getByRole('option', { name: '27' }));
    expect(pageSizeSelect).toContainElement(screen.getByRole('option', { name: '2109845' }));
    expect(pageSizeSelect.children).toHaveLength(4);
});

it('Fullscreen parameter sets min height of results area', () => {
    render(
        <Components.SearchInterface
            fullScreen={true}
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
    expect(screen.getByRole('article')).toHaveClass('min-h-screen');
});

it('Search input has value of query prop', () => {
    const query = 'Cereal';
    render(
        <Components.SearchInterface
            handleSearchFormSubmit={jest.fn}
            isValidating={false}
            limit={10}
            offset={0}
            query={query}
            results={[]}
            searchType="publication-versions"
            setLimit={jest.fn}
            setOffset={jest.fn}
            total={0}
        />
    );
    expect(screen.getByRole('textbox', { name: 'Quick search' })).toHaveValue(query);
});
