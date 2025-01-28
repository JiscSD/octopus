import * as Components from '@/components';

import { render, screen } from '@testing-library/react';

jest.mock('next/router', () => ({
    useRouter: jest.fn()
}));

it('Title is as expected', () => {
    render(
        <Components.SearchPage
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
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Search results');
});

it('Title contains query when passed', () => {
    render(
        <Components.SearchPage
            handleSearchFormSubmit={jest.fn}
            isValidating={false}
            limit={10}
            offset={0}
            query={'Politics'}
            results={[]}
            searchType="publication-versions"
            setLimit={jest.fn}
            setOffset={jest.fn}
            total={0}
        />
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Search results for Politics');
});
