import React from 'react';

import * as Components from '@/components';
import * as Interfaces from '@/interfaces';
import * as Types from '@/types';

type SearchResults =
    | Interfaces.PublicationVersion[]
    | Interfaces.CoreUser[]
    | Pick<Interfaces.BaseTopic, 'id' | 'title' | 'createdAt'>[];
type Props = {
    error?: string;
    filters?: React.ReactNode;
    handleSearchFormSubmit: React.ReactEventHandler<HTMLFormElement>;
    isValidating: boolean;
    limit: number;
    offset: number;
    noResultsMessage?: string;
    query: string | null;
    resetFilters?: () => void;
    results: SearchResults;
    searchType: Types.SearchType;
    setLimit: (limit: React.SetStateAction<number>) => void;
    setOffset: (offset: React.SetStateAction<number>) => void;
    showSearchTypeSwitch?: boolean;
    total: number;
};

const SearchPage = React.forwardRef(
    (props: Props, searchInputRef: React.ForwardedRef<HTMLInputElement>): React.ReactElement => {
        return (
            <>
                <section className="container mx-auto px-8 py-8 lg:pb-0 lg:pt-16">
                    <Components.PageTitle text={`Search results ${props.query ? `for ${props.query}` : ''}`} />
                </section>
                <section id="content" className="container px-8">
                    <Components.SearchInterface
                        error={props.error}
                        filters={props.filters}
                        fullScreen={true}
                        handleSearchFormSubmit={props.handleSearchFormSubmit}
                        isValidating={props.isValidating}
                        limit={props.limit}
                        offset={props.offset}
                        noResultsMessage={props.noResultsMessage}
                        query={props.query}
                        ref={searchInputRef}
                        resetFilters={props.resetFilters}
                        results={props.results}
                        searchType={props.searchType}
                        setLimit={props.setLimit}
                        setOffset={props.setOffset}
                        showSearchTypeSwitch={props.showSearchTypeSwitch}
                        total={props.total}
                    />
                </section>
            </>
        );
    }
);
SearchPage.displayName = 'SearchPage';

export default SearchPage;
