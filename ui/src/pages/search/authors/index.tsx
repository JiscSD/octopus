import React from 'react';
import useSWR from 'swr';
import Head from 'next/head';

import * as Router from 'next/router';
import * as Framer from 'framer-motion';
import * as SolidIcons from '@heroicons/react/solid';
import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Types from '@types';
import * as api from '@api';

/**
 *
 * @TODO - refactor getServerSideProps
 * remove unnecessary if statements
 */

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    // defaults to possible query params
    let searchType: Types.SearchType = 'authors';
    let query: string | string[] | null = null;
    let limit: number | string | string[] | null = null;
    let offset: number | string | string[] | null = null;

    // defaults to results
    let results: Interfaces.CoreUser[] | [] = [];
    let metadata: Interfaces.SearchResultMeta | {} = {};

    // default error
    let error: string | null = null;

    // setting params
    if (context.query.query) query = context.query.query;
    if (context.query.limit) limit = context.query.limit;
    if (context.query.offset) offset = context.query.offset;

    // If multiple of the same params are provided, pick the first
    if (Array.isArray(query)) query = query[0];
    if (Array.isArray(limit)) limit = limit[0];
    if (Array.isArray(offset)) offset = offset[0];

    // params come in as strings, so make sure the value of the string is parsable as a number or ignore it
    limit && !Number.isNaN(parseInt(limit, 10)) ? (limit = parseInt(limit, 10)) : (limit = null);
    offset && !Number.isNaN(parseInt(offset, 10)) ? (offset = parseInt(offset, 10)) : (offset = null);

    // ensure the value of the seach type is acceptable
    // ensure the value of the search type is acceptable

    try {
        const response = await api.search<Interfaces.User>(searchType, encodeURIComponent(query || ''), limit, offset);
        results = response.data;
        metadata = response.metadata;
        error = null;
    } catch (err) {
        const { message } = err as Interfaces.JSONResponseError;
        error = message;
    }

    const swrKey = `/users?search=${encodeURIComponent((Array.isArray(query) ? query[0] : query) || '')}&limit=${
        limit || '10'
    }&offset=${offset || '0'}`;

    return {
        props: {
            searchType,
            query,
            limit,
            offset,
            fallback: {
                [swrKey]: results
            },
            error
        }
    };
};

type Props = {
    searchType?: Types.SearchType;
    query: string | null;
    limit: string | null;
    offset: string | null;
    error: string | null;
};

const Search: Types.NextPage<Props> = (props): React.ReactElement => {
    const router = Router.useRouter();
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    // params
    const [searchType] = React.useState(props.searchType);
    const [query, setQuery] = React.useState(props.query ? props.query : '');
    // param for pagination
    const [limit, setLimit] = React.useState(props.limit ? parseInt(props.limit, 10) : 10);
    const [offset, setOffset] = React.useState(props.offset ? parseInt(props.offset, 10) : 0);

    // ugly complex swr key

    const swrKey = `/users?search=${encodeURIComponent(query || '')}&limit=${limit || '10'}&offset=${offset || '0'}`;

    const { data: { data: results = [] } = {}, error, isValidating } = useSWR(swrKey);

    const handlerSearchFormSubmit: React.ReactEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const searchTerm = searchInputRef.current?.value || '';
        setQuery(searchTerm);
    };

    React.useEffect(() => {
        setOffset(0);
    }, [query, limit]);

    return (
        <>
            <Head>
                <meta name="description" content={Config.urls.search.description} />
                <meta name="keywords" content={Config.urls.search.keywords.join(', ')} />
                <link rel="canonical" href={Config.urls.search.canonical} />
                <title>{Config.urls.search.title}</title>
            </Head>

            <Layouts.Standard>
                <section className="container mx-auto px-8 py-8 lg:gap-4 lg:pt-16 lg:pb-0">
                    <Components.PageTitle text={`Search results ${query ? `for ${query}` : ''}`} />
                </section>
                <section
                    id="content"
                    className="container mx-auto grid grid-cols-1 px-8 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-8"
                >
                    <fieldset className="col-span-12 mb-8 grid w-full grid-cols-12 items-end gap-y-4 gap-x-6 lg:mb-0 lg:gap-x-6 2xl:gap-x-10">
                        <legend className="sr-only">Search options</legend>

                        <label htmlFor="search-type" className="relative col-span-8 block lg:col-span-3">
                            <span className="mb-1 block text-xxs font-bold uppercase tracking-widest text-grey-600 transition-colors duration-500 dark:text-grey-300">
                                Searching
                            </span>
                            <select
                                name="search-type"
                                id="search-type"
                                onChange={(e) => router.push(`/search/${e.target.value}`)}
                                value={searchType}
                                className="col-span-3 !mt-0 block w-full rounded-md border border-grey-200 outline-none focus:ring-2 focus:ring-yellow-500"
                                disabled={isValidating}
                            >
                                <option value="publications">Publications</option>
                                <option value="authors">Authors</option>
                            </select>
                        </label>

                        <label
                            htmlFor="order-direction"
                            className="relative col-span-4 block lg:col-span-2 xl:col-span-1"
                        >
                            <span className="mb-1 block text-xxs font-bold uppercase tracking-widest text-grey-600 transition-colors duration-500 dark:text-grey-300">
                                Showing
                            </span>
                            <select
                                name="order-direction"
                                id="order-direction"
                                onChange={(e) => setLimit(parseInt(e.target.value, 10))}
                                value={limit}
                                className="w-full rounded-md border border-grey-200 outline-none focus:ring-2 focus:ring-yellow-500"
                                disabled={isValidating}
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                        </label>

                        <form
                            name="query-form"
                            id="query-form"
                            className="col-span-12 lg:col-span-7 xl:col-span-8"
                            onSubmit={handlerSearchFormSubmit}
                        >
                            <label htmlFor="search-query" className="relative block w-full">
                                <span className="mb-1 block text-xxs font-bold uppercase tracking-widest text-grey-600 transition-colors duration-500 dark:text-grey-300">
                                    Quick search
                                </span>
                                <input
                                    ref={searchInputRef}
                                    name="query"
                                    id="query"
                                    defaultValue={props.query ? props.query : ''}
                                    type="text"
                                    placeholder="Type here and press enter..."
                                    className="w-full rounded-md border border-grey-200 px-4 py-2 outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-70"
                                    disabled={isValidating}
                                />
                                <button
                                    type="submit"
                                    form="query-form"
                                    aria-label="Search"
                                    className="absolute right-px rounded-md p-2 outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-70"
                                    disabled={isValidating}
                                >
                                    <SolidIcons.SearchIcon className="h-6 w-6 text-teal-500" />
                                </button>
                            </label>
                        </form>
                    </fieldset>

                    <article className="col-span-12 min-h-screen">
                        {props.error ? (
                            <Components.Alert
                                severity="ERROR"
                                title={props.error}
                                details={['Placeholder support text here']}
                            />
                        ) : (
                            <Framer.AnimatePresence>
                                {error && (
                                    <Components.Alert
                                        severity="ERROR"
                                        title={error}
                                        details={['Placeholder support text here']}
                                    />
                                )}

                                {!error && !results?.data?.length && !isValidating && (
                                    <Components.Alert
                                        severity="INFO"
                                        title="No results found"
                                        details={[
                                            'Try a different search criteria.',
                                            'If you think something is wrong, please contact the helpdesk.'
                                        ]}
                                    />
                                )}

                                {!isValidating && results?.data?.length && (
                                    <>
                                        <div className="rounded">
                                            {results.data.map((result: any, index: number) => {
                                                let classes = '';
                                                index === 0 ? (classes += 'rounded-t') : null;
                                                index === results.data.length - 1
                                                    ? (classes += '!border-b-transparent !rounded-b')
                                                    : null;

                                                return (
                                                    <Components.UserSearchResult
                                                        key={`user-${index}-${result.id}`}
                                                        user={result}
                                                        className={classes}
                                                    />
                                                );
                                            })}
                                        </div>

                                        {!isValidating && !!results.data.length && (
                                            <Components.Delay delay={results.data.length * 50}>
                                                <Framer.motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ type: 'tween', duration: 0.75 }}
                                                    className="mt-8 w-full items-center justify-between lg:flex lg:flex-row-reverse"
                                                >
                                                    <div className="flex justify-between">
                                                        <button
                                                            onClick={(e) => {
                                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                setOffset((prev) => prev - limit);
                                                            }}
                                                            disabled={offset === 0}
                                                            className="mr-6 rounded font-semibold text-grey-800 underline decoration-teal-500 decoration-2 underline-offset-4 outline-none transition-colors duration-500 focus:ring-2 focus:ring-yellow-500 disabled:decoration-teal-600 disabled:opacity-70 dark:text-white-50"
                                                        >
                                                            Previous
                                                        </button>

                                                        <button
                                                            onClick={(e) => {
                                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                setOffset((prev) => prev + limit);
                                                            }}
                                                            className="rounded font-semibold text-grey-800 underline decoration-teal-500 decoration-2 underline-offset-4 outline-none transition-colors duration-500 focus:ring-2 focus:ring-yellow-500 disabled:decoration-teal-600 disabled:opacity-70 dark:text-white-50"
                                                            disabled={limit + offset > results.metadata.total}
                                                        >
                                                            Next
                                                        </button>
                                                    </div>
                                                    <span className="mt-4 block font-medium text-grey-800 transition-colors duration-500 dark:text-white-50">
                                                        Showing {offset + 1} -{' '}
                                                        {limit + offset > results.metadata.total
                                                            ? results.metadata.total
                                                            : limit + offset}{' '}
                                                        of {results.metadata.total}
                                                    </span>
                                                </Framer.motion.div>
                                            </Components.Delay>
                                        )}
                                    </>
                                )}
                            </Framer.AnimatePresence>
                        )}
                    </article>
                </section>
            </Layouts.Standard>
        </>
    );
};

export default Search;
