import React from 'react';
import * as Framer from 'framer-motion';
import * as Router from 'next/router';
import * as SolidIcons from '@heroicons/react/24/solid';

import * as Components from '@/components';
import * as Helpers from '@/helpers';
import * as Interfaces from '@/interfaces';
import * as Types from '@/types';

type Props = {
    error?: string;
    filters?: React.ReactNode;
    handleSearchFormSubmit: React.ReactEventHandler<HTMLFormElement>;
    isValidating: boolean;
    limit: number;
    offset: number;
    query: string | null;
    resetFilters?: () => void;
    searchType: Types.SearchType;
    setLimit: (limit: React.SetStateAction<number>) => void;
    setOffset: (offset: React.SetStateAction<number>) => void;
    total: number;
} & (
    | {
          results: Interfaces.PublicationVersion[];
      }
    | {
          results: Interfaces.CoreUser[];
      }
    | {
          results: Pick<Interfaces.BaseTopic, 'id' | 'title' | 'createdAt'>[];
      }
);

const SearchPage = React.forwardRef(
    (props: Props, searchInputRef: React.ForwardedRef<HTMLInputElement>): React.ReactElement => {
        const router = Router.useRouter();

        const upperPageBound = props.limit + props.offset > props.total ? props.total : props.limit + props.offset;

        return (
            <>
                <section className="container mx-auto px-8 py-8 lg:pb-0 lg:pt-16">
                    <Components.PageTitle text={`Search results ${props.query ? `for ${props.query}` : ''}`} />
                </section>
                <section
                    id="content"
                    className="container mx-auto grid grid-cols-1 gap-x-6 px-8 lg:grid-cols-12 lg:gap-y-8 2xl:gap-x-10"
                >
                    <div className="col-span-12 mb-8 grid w-full grid-cols-12 gap-x-6 gap-y-4 lg:mb-0 2xl:gap-x-10">
                        <fieldset className="col-span-12 lg:col-span-5 xl:col-span-4 grid grid-cols-12 gap-x-6 2xl:gap-x-10">
                            <legend className="sr-only">Search options</legend>

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

                            <label htmlFor="pageSize" className="col-span-4 block xl:col-span-3">
                                <span className="mb-1 block text-xxs font-bold uppercase tracking-widest text-grey-600 transition-colors duration-500 dark:text-grey-300">
                                    Showing
                                </span>
                                <select
                                    name="pageSize"
                                    id="pageSize"
                                    onChange={(e) => props.setLimit(parseInt(e.target.value, 10))}
                                    value={props.limit}
                                    className="w-full rounded-md border border-grey-200 focus:ring-2 focus:ring-yellow-500"
                                    disabled={props.isValidating}
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                </select>
                            </label>
                        </fieldset>
                        <form
                            name="query-form"
                            id="query-form"
                            className="col-span-12 lg:col-span-7 xl:col-span-8"
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
                    <article className={`col-span-12 min-h-screen ${props.filters && 'lg:col-span-9'}`}>
                        <div aria-live="polite" className="sr-only">
                            {props.error ? props.error : `${props.total} result${props.total !== 1 ? 's' : ''}`}
                        </div>
                        {props.error ? (
                            <Components.Alert severity="ERROR" title={props.error} />
                        ) : (
                            <Framer.AnimatePresence>
                                {!props.error && !props.results.length && !props.isValidating && (
                                    <Components.Alert
                                        severity="INFO"
                                        title="No results found"
                                        details={[
                                            'Try some different search criteria.',
                                            'If you think something is wrong, please contact the helpdesk.'
                                        ]}
                                    />
                                )}

                                {props.results.length && (
                                    <>
                                        <div className="rounded">
                                            {props.results.map((result, index: number) => {
                                                let classes = '';

                                                if (index === 0) {
                                                    classes += 'rounded-t';
                                                }

                                                if (index === props.results.length - 1) {
                                                    classes += '!border-b-transparent !rounded-b';
                                                }

                                                return props.searchType === 'publication-versions' ? (
                                                    <Components.PublicationSearchResult
                                                        key={`publication-${index}-${result.id}`}
                                                        publicationVersion={result as Interfaces.PublicationVersion}
                                                        className={classes}
                                                    />
                                                ) : props.searchType === 'authors' ||
                                                  props.searchType === 'organisations' ? (
                                                    <Components.UserSearchResult
                                                        key={`user-${index}-${result.id}`}
                                                        user={result as Interfaces.User}
                                                        className={classes}
                                                    />
                                                ) : props.searchType == 'topics' ? (
                                                    <Components.TopicSearchResult
                                                        key={`topic-${index}-${result.id}`}
                                                        topic={result as Interfaces.BaseTopic}
                                                        className={classes}
                                                    />
                                                ) : (
                                                    <></>
                                                );
                                            })}
                                        </div>

                                        {!props.isValidating && !!props.results.length && (
                                            <Framer.motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ type: 'tween', duration: 0.75 }}
                                                className="mt-8 w-full justify-between lg:flex lg:flex-row-reverse"
                                            >
                                                <div className="flex justify-between">
                                                    <Components.Button
                                                        className="mr-6"
                                                        onClick={() => {
                                                            props.setOffset(props.offset - props.limit);
                                                            Helpers.scrollTopSmooth();
                                                        }}
                                                        disabled={props.offset === 0}
                                                        title="Previous"
                                                    />
                                                    <Components.Button
                                                        onClick={() => {
                                                            props.setOffset(props.offset + props.limit);
                                                            Helpers.scrollTopSmooth();
                                                        }}
                                                        disabled={props.limit + props.offset >= props.total}
                                                        title="Next"
                                                    />
                                                </div>
                                                <span
                                                    id="pagination-info"
                                                    className="mt-4 block font-medium text-grey-800 transition-colors duration-500 dark:text-white-50"
                                                >
                                                    Showing {props.offset + 1} - {upperPageBound} of {props.total}
                                                </span>
                                            </Framer.motion.div>
                                        )}
                                    </>
                                )}
                            </Framer.AnimatePresence>
                        )}
                    </article>
                </section>
            </>
        );
    }
);

export default SearchPage;
