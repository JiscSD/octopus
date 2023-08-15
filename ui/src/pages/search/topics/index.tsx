import React, { FormEvent, useEffect } from 'react';
import useSWR from 'swr';
import Head from 'next/head';

import * as Router from 'next/router';
import * as Framer from 'framer-motion';
import * as SolidIcons from '@heroicons/react/24/solid';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Types from '@types';
import * as api from '@api';
import * as Helpers from '@helpers';

const pageSizes = [5, 10, 15, 20, 50];

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const searchType: Types.SearchType = 'topics';
    let { query = '' } = context.query as Interfaces.TopicsPageQuery;
    let error: string | null = null;
    let fallbackData: Interfaces.TopicsPaginatedResults = {
        offset: 0,
        limit: 10,
        results: [],
        total: 0
    };

    const topicsUrl = `${Config.endpoints.topics}?offset=${fallbackData.offset}&limit=${fallbackData.limit}&search=${query}`;

    try {
        fallbackData = (await api.get(topicsUrl, undefined)).data;
    } catch (error) {
        const { message } = error as Interfaces.JSONResponseError;
        error = message;
    }

    return {
        props: {
            error,
            searchType,
            fallback: {
                [topicsUrl]: fallbackData
            }
        }
    };
};

type Props = {
    error: string | null;
    searchType: Types.SearchType;
    fallback: { [key: string]: Interfaces.TopicsPaginatedResults };
};

const Topics: Types.NextPage<Props> = (props): React.ReactElement => {
    const router = Router.useRouter();
    const { query = '' } = router.query as Interfaces.TopicsPageQuery;
    const [limit, setLimit] = React.useState(10);
    const [offset, setOffset] = React.useState(0);

    const { data, error, isValidating } = useSWR<Interfaces.TopicsPaginatedResults>(
        `${Config.endpoints.topics}?offset=${offset}&limit=${limit}&search=${query}`,
        {
            fallback: props.fallback,
            use: [Helpers.laggy]
        }
    );

    const handleSearchFormSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const searchTerm = e.currentTarget.searchTerm.value;
        const newQuery = { ...router.query, query: searchTerm };

        if (!searchTerm) {
            delete newQuery.query; // remove query param from browser url
        }

        await router.push({ query: newQuery }, undefined, { shallow: true });
        setOffset(0);
    };

    const handlePageSizeChange: React.ChangeEventHandler<HTMLSelectElement> = async (e) =>
        setLimit(Number(e.target.value));

    const handleGoNext = async () => {
        setOffset((prevOffset) => prevOffset + limit);
        Helpers.scrollTopSmooth();
    };

    const handleGoBack = async () => {
        setOffset((prevOffset) => (prevOffset - limit < 0 ? 0 : prevOffset - limit));
        Helpers.scrollTopSmooth();
    };

    return (
        <>
            <Head>
                <meta name="description" content={Config.urls.search.description} />
                <meta name="keywords" content={Config.urls.search.keywords.join(', ')} />
                <link rel="canonical" href={Config.urls.search.canonical} />
                <title>{Config.urls.search.title.replace('publications', 'topics')}</title>
            </Head>

            <Layouts.Standard>
                <section className="container mx-auto px-8 py-8 lg:gap-4 lg:pb-0 lg:pt-16">
                    <Components.PageTitle
                        text={`Search results ${router.query.query ? `for ${router.query.query}` : ''}`}
                    />
                </section>
                <section
                    id="content"
                    className="container mx-auto grid grid-cols-1 gap-x-6 px-8 lg:grid-cols-12 lg:gap-y-8 2xl:gap-x-10"
                >
                    <fieldset className="col-span-12 mb-8 grid w-full grid-cols-12 items-end gap-x-6 gap-y-4 lg:mb-0 lg:gap-x-6 2xl:gap-x-10">
                        <legend className="sr-only">Search options</legend>

                        <label htmlFor="search-type" className="relative col-span-8 block lg:col-span-3">
                            <span className="mb-1 block text-xxs font-bold uppercase tracking-widest text-grey-600 transition-colors duration-500 dark:text-grey-300">
                                Searching
                            </span>
                            <select
                                name="search-type"
                                id="search-type"
                                onChange={(e) => router.push(`/search/${e.target.value}`)}
                                value={props.searchType}
                                className="col-span-3 !mt-0 block w-full rounded-md border border-grey-200 outline-none focus:ring-2 focus:ring-yellow-500"
                                disabled={isValidating}
                            >
                                <option value="publications">Publications</option>
                                <option value="authors">Authors</option>
                                <option value="topics">Topics</option>
                            </select>
                        </label>

                        <label htmlFor="pageSize" className="relative col-span-4 block lg:col-span-2 xl:col-span-1">
                            <span className="mb-1 block text-xxs font-bold uppercase tracking-widest text-grey-600 transition-colors duration-500 dark:text-grey-300">
                                Showing
                            </span>
                            <select
                                name="pageSize"
                                id="pageSize"
                                onChange={handlePageSizeChange}
                                value={limit}
                                className="w-full rounded-md border border-grey-200 outline-none focus:ring-2 focus:ring-yellow-500"
                                disabled={isValidating}
                            >
                                {pageSizes.map((pageSize) => (
                                    <option key={pageSize} value={pageSize}>
                                        {pageSize}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <form
                            id="query-form"
                            className="col-span-12 lg:col-span-7 xl:col-span-8"
                            onSubmit={handleSearchFormSubmit}
                        >
                            <label htmlFor="searchTerm" className="relative block w-full">
                                <span className="mb-1 block text-xxs font-bold uppercase tracking-widest text-grey-600 transition-colors duration-500 dark:text-grey-300">
                                    Quick search
                                </span>
                                <input
                                    name="searchTerm"
                                    id="searchTerm"
                                    defaultValue={query}
                                    type="text"
                                    placeholder="Type here and press enter..."
                                    className="w-full rounded-md border border-grey-200 px-4 py-2 outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-70"
                                    disabled={isValidating}
                                />
                                <button
                                    type="submit"
                                    aria-label="Search"
                                    className="absolute right-px rounded-md p-2 outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-70"
                                    disabled={isValidating}
                                >
                                    <SolidIcons.MagnifyingGlassIcon className="h-6 w-6 text-teal-500" />
                                </button>
                            </label>
                        </form>
                    </fieldset>

                    <article className="col-span-12 min-h-screen">
                        {props.error ? (
                            <Components.Alert severity="ERROR" title={props.error} />
                        ) : (
                            <Framer.AnimatePresence>
                                {error && <Components.Alert severity="ERROR" title={error.message} />}

                                {!error && !data?.results?.length && !isValidating && (
                                    <Components.Alert
                                        severity="INFO"
                                        title="No results found"
                                        details={[
                                            'Try a different search criteria.',
                                            'If you think something is wrong, please contact the helpdesk.'
                                        ]}
                                    />
                                )}

                                {data?.results?.length && (
                                    <>
                                        <div className="rounded">
                                            {data.results.map((topic, index) => {
                                                let classes = '';
                                                index === 0 ? (classes += 'rounded-t') : null;
                                                index === data.results.length - 1
                                                    ? (classes += '!border-b-transparent !rounded-b')
                                                    : null;

                                                return (
                                                    <Framer.motion.div
                                                        key={topic.id}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ type: 'tween', duration: 0.35 }}
                                                    >
                                                        <Components.Link
                                                            href={`${Config.urls.viewTopic.path}/${topic.id}`}
                                                            role="button"
                                                            className={`
                                                    grid
                                                    overflow-hidden
                                                    rounded-none
                                                    border-b
                                                    border-grey-50
                                                    bg-white-50
                                                    px-4
                                                    py-7
                                                    shadow
                                                    outline-0
                                                    transition-colors
                                                    duration-500
                                                    hover:opacity-95
                                                    focus:overflow-hidden
                                                    focus:border-transparent
                                                    focus:opacity-95
                                                    focus:ring-2
                                                    focus:ring-yellow-500
                                                    dark:border-grey-600
                                                    dark:bg-grey-700
                                                    lg:grid-cols-12
                                                    ${classes ? classes : ''}
                                                    `}
                                                        >
                                                            <div className="z-10 col-span-11 w-full">
                                                                <h2 className="col-span-7 leading-6 text-grey-800 transition-colors duration-500 dark:text-white-50">
                                                                    {topic.title}
                                                                </h2>
                                                            </div>

                                                            <div className="lg: col-span-1 mt-4 hidden h-full w-full items-center justify-end lg:mt-0 lg:flex">
                                                                <OutlineIcons.ChevronRightIcon className="h-5 w-5 text-teal-400" />
                                                            </div>
                                                        </Components.Link>
                                                    </Framer.motion.div>
                                                );
                                            })}
                                        </div>

                                        {!isValidating && !!data.results.length && (
                                            <Components.Delay delay={data.results.length * 50}>
                                                <Framer.motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ type: 'tween', duration: 0.75 }}
                                                    className="mt-8 w-full items-center justify-between lg:flex lg:flex-row-reverse"
                                                >
                                                    <div className="flex justify-between">
                                                        <button
                                                            onClick={handleGoBack}
                                                            disabled={offset === 0}
                                                            className="mr-6 rounded font-semibold text-grey-800 underline decoration-teal-500 decoration-2 underline-offset-4 outline-none transition-colors duration-500 focus:ring-2 focus:ring-yellow-500 disabled:decoration-teal-600 disabled:opacity-70 dark:text-white-50"
                                                        >
                                                            Previous
                                                        </button>

                                                        <button
                                                            onClick={handleGoNext}
                                                            className="rounded font-semibold text-grey-800 underline decoration-teal-500 decoration-2 underline-offset-4 outline-none transition-colors duration-500 focus:ring-2 focus:ring-yellow-500 disabled:decoration-teal-600 disabled:opacity-70 dark:text-white-50"
                                                            disabled={limit + offset >= data.total}
                                                        >
                                                            Next
                                                        </button>
                                                    </div>
                                                    <span
                                                        id="pagination-info"
                                                        className="mt-4 block font-medium text-grey-800 transition-colors duration-500 dark:text-white-50"
                                                    >
                                                        Showing {offset + 1} -{' '}
                                                        {limit + offset > data.total ? data.total : limit + offset} of{' '}
                                                        {data.total}
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

export default Topics;
