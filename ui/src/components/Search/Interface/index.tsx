import React from 'react';
import * as Framer from 'framer-motion';
import * as Router from 'next/router';
import * as SolidIcons from '@heroicons/react/24/solid';

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
    fullScreen?: boolean;
    handleSearchFormSubmit: React.ReactEventHandler<HTMLFormElement>;
    isValidating: boolean;
    limit: number;
    noResultsMessage?: string;
    offset: number;
    pageSizes?: number[];
    query: string | null;
    resetFilters?: () => void;
    results: SearchResults;
    searchType: Types.SearchType;
    setLimit: (limit: React.SetStateAction<number>) => void;
    setOffset: (offset: React.SetStateAction<number>) => void;
    showSearchTypeSwitch?: boolean;
    total: number;
};

const SearchInterface = React.forwardRef(
    (props: Props, searchInputRef: React.ForwardedRef<HTMLInputElement>): React.ReactElement => {
        const router = Router.useRouter();
        const scrollTargetRef = React.useRef<HTMLDivElement>(null);

        const results = (
            <div className="rounded">
                {props.results.map((result, index: number) => {
                    let classes = '';

                    if (index === 0) {
                        classes += 'rounded-t';
                    }

                    if (index === props.results.length - 1) {
                        classes += ' !border-b-transparent !rounded-b';
                    }

                    if (props.searchType === 'publication-versions') {
                        const { coAuthors, content, description, publication, publishedDate, title, versionOf } =
                            result as Interfaces.PublicationVersion;
                        return (
                            <Components.PublicationSearchResult
                                key={`publication-${index}-${result.id}`}
                                coAuthors={coAuthors}
                                content={content}
                                description={description}
                                flagCount={publication.flagCount}
                                peerReviewCount={publication.peerReviewCount}
                                publicationId={versionOf}
                                publishedDate={publishedDate}
                                title={title}
                                type={publication.type}
                                className={classes}
                            />
                        );
                    }

                    if (props.searchType === 'authors' || props.searchType === 'organisations') {
                        return (
                            <Components.UserSearchResult
                                key={`user-${index}-${result.id}`}
                                user={result as Interfaces.User}
                                className={classes}
                            />
                        );
                    }

                    if (props.searchType == 'topics') {
                        return (
                            <Components.TopicSearchResult
                                key={`topic-${index}-${result.id}`}
                                topic={result as Interfaces.BaseTopic}
                                className={classes}
                            />
                        );
                    }

                    return <></>;
                })}
            </div>
        );

        return (
            <div className="mx-auto grid grid-cols-1 gap-x-6 lg:grid-cols-12 lg:gap-y-8 2xl:gap-x-10">
                <div
                    className="col-span-12 mb-8 grid w-full grid-cols-12 gap-x-6 gap-y-4 lg:mb-0 2xl:gap-x-10"
                    ref={scrollTargetRef}
                >
                    <fieldset
                        className={`col-span-12 ${props.showSearchTypeSwitch ? 'grid grid-cols-12 gap-x-6 2xl:gap-x-10 lg:col-span-5 xl:col-span-4' : 'lg:col-span-3 xl:col-span-2'}`}
                    >
                        <legend className="sr-only">Search options</legend>

                        {props.showSearchTypeSwitch && (
                            <label htmlFor="search-type" className="col-span-8 xl:col-span-9 block">
                                <span className="mb-1 block text-xxs font-bold uppercase tracking-widest text-grey-600 transition-colors duration-500 dark:text-grey-300">
                                    Searching
                                </span>
                                <select
                                    id="search-type"
                                    onChange={(e) => router.push(`/search/${e.target.value}`)}
                                    value={props.searchType}
                                    className="col-span-3 w-full rounded-md border border-grey-200 focus:ring-2 focus:ring-yellow-500"
                                    disabled={props.isValidating}
                                >
                                    <option value="publications">Publications</option>
                                    <option value="authors">Authors</option>
                                    <option value="topics">Topics</option>
                                    <option value="organisations">Organisations</option>
                                </select>
                            </label>
                        )}
                        <label
                            className={`block ${props.showSearchTypeSwitch ? 'col-span-4 xl:col-span-3' : 'col-span-12'}`}
                            htmlFor="pageSize"
                        >
                            <span className="mb-1 block text-xxs font-bold uppercase tracking-widest text-grey-600 transition-colors duration-500 dark:text-grey-300">
                                Showing
                            </span>
                            <select
                                name="pageSize"
                                id="pageSize"
                                onChange={(e) => props.setLimit(parseInt(e.target.value, 10))}
                                value={props.limit}
                                className={`w-full rounded-md border border-grey-200 focus:ring-2 focus:ring-yellow-500 ${!props.showSearchTypeSwitch && 'sm:w-1/4 lg:w-full'}`}
                                disabled={props.isValidating}
                            >
                                {props.pageSizes?.length ? (
                                    props.pageSizes.map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))
                                ) : (
                                    <>
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="15">15</option>
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                    </>
                                )}
                            </select>
                        </label>
                    </fieldset>
                    <form
                        name="query-form"
                        id="query-form"
                        className={`col-span-12 ${props.showSearchTypeSwitch ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-9 xl:col-span-10'}`}
                        onSubmit={props.handleSearchFormSubmit}
                    >
                        <label htmlFor="searchTerm" className="relative w-full">
                            <span className="mb-1 block text-xxs font-bold uppercase tracking-widest text-grey-600 transition-colors duration-500 dark:text-grey-300">
                                Quick search
                            </span>
                            <input
                                name="searchTerm"
                                id="searchTerm"
                                defaultValue={props.query ? props.query : ''}
                                type="text"
                                placeholder="Type here and press enter..."
                                className="w-full rounded-md border border-grey-200 px-4 py-2 focus:ring-2 focus:ring-yellow-500 disabled:opacity-70"
                                disabled={props.isValidating}
                                ref={searchInputRef}
                            />
                            <button
                                type="submit"
                                form="query-form"
                                aria-label="Search"
                                className="absolute right-px rounded-md p-2 outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-70"
                                disabled={props.isValidating}
                            >
                                <SolidIcons.MagnifyingGlassIcon className="h-6 w-6 text-teal-500" />
                            </button>
                        </label>
                    </form>
                </div>
                {props.filters && (
                    <aside className="relative col-span-3 hidden lg:block">
                        <Framer.AnimatePresence>
                            <Framer.motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="sticky top-16 space-y-6 divide-y divide-grey-100"
                            >
                                <div className="space-y-5">{props.filters}</div>
                                {props.resetFilters && (
                                    <div className="pt-5">
                                        <Components.Button
                                            endIcon={<SolidIcons.XCircleIcon className="h-5 w-4 text-teal-500" />}
                                            onClick={props.resetFilters}
                                            title="Clear filters"
                                        />
                                    </div>
                                )}
                            </Framer.motion.div>
                        </Framer.AnimatePresence>
                    </aside>
                )}
                <Components.PaginatedResults
                    className={`col-span-12 ${props.fullScreen && 'min-h-screen'} ${props.filters && 'lg:col-span-9'}`}
                    error={props.error}
                    isValidating={props.isValidating}
                    limit={props.limit}
                    noResultsMessage={props.noResultsMessage}
                    offset={props.offset}
                    results={results}
                    scrollFunction={
                        scrollTargetRef.current
                            ? () => scrollTargetRef.current?.scrollIntoView({ behavior: 'smooth' })
                            : undefined
                    }
                    setOffset={props.setOffset}
                    total={props.total}
                />
            </div>
        );
    }
);
SearchInterface.displayName = 'SearchInterface';

export default SearchInterface;
