import { DateTime } from 'luxon';
import React from 'react';
import useSWR from 'swr';
import Head from 'next/head';

import * as Router from 'next/router';
import * as Framer from 'framer-motion';
import * as SolidIcons from '@heroicons/react/24/solid';
import * as Interfaces from '@/interfaces';
import * as Components from '@/components';
import * as Helpers from '@/helpers';
import * as Layouts from '@/layouts';
import * as Config from '@/config';
import * as Types from '@/types';
import * as api from '@/api';

// Takes an input date from context or form controls,
// sets time to start or end of day as appropriate,
// and returns it as an ISO string for the API.
const formatDateForAPI = (rawDate: string, type: 'to' | 'from'): string | null => {
    const date = new Date(rawDate);

    if (isNaN(date.getTime())) {
        return null;
    }

    if (type === 'from') {
        date.setHours(0, 0, 0);
    } else {
        date.setHours(23, 59, 59);
    }

    return date.toISOString();
};

/**
 *
 * @TODO - refactor getServerSideProps
 * 1. remove unnecessary if statements
 * 2. make sure correct publicationTypes are passed via props
 */

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    // defaults to possible query params
    const searchType: Types.SearchType = 'publication-versions';
    let query: string | string[] | null = null;
    let publicationTypes: string | string[] | null = null;
    let limit: number | string | string[] | null = null;
    let offset: number | string | string[] | null = null;
    let dateFrom: string | string[] | null = null;
    let dateTo: string | string[] | null = null;

    // defaults to results
    let searchResults: { data: Interfaces.PublicationVersion[]; metadata: Interfaces.SearchResultMeta } = {
        data: [],
        metadata: {
            limit: 10,
            offset: 0,
            total: 0
        }
    };

    // default error
    let error: string | null = null;

    // setting params
    if (context.query.query) query = context.query.query;
    if (context.query.type) publicationTypes = context.query.type;
    if (context.query.limit) limit = context.query.limit;
    if (context.query.offset) offset = context.query.offset;
    if (context.query.dateFrom) dateFrom = context.query.dateFrom;
    if (context.query.dateTo) dateTo = context.query.dateTo;

    if (Array.isArray(query)) query = query[0];
    if (Array.isArray(publicationTypes)) publicationTypes = publicationTypes[0];
    if (Array.isArray(limit)) limit = limit[0];
    if (Array.isArray(offset)) offset = offset[0];
    if (Array.isArray(dateFrom)) dateFrom = dateFrom[0];
    if (Array.isArray(dateTo)) dateTo = dateTo[0];

    if (publicationTypes) {
        // filter valid publication types only
        publicationTypes = publicationTypes
            .split(',')
            .filter((type) => Config.values.publicationTypes.includes(type as Types.PublicationType))
            .join(',');
    }

    // params come in as strings, so make sure the value of the string is parsable as a number or ignore it
    limit && !Number.isNaN(parseInt(limit, 10)) ? (limit = parseInt(limit, 10)) : (limit = null);
    offset && !Number.isNaN(parseInt(offset, 10)) ? (offset = parseInt(offset, 10)) : (offset = null);

    // ensure the value of the search type is acceptable
    try {
        const response = await api.search<Interfaces.PublicationVersion>(
            searchType,
            encodeURIComponent(query || ''),
            limit,
            offset,
            publicationTypes
        );

        searchResults = response;

        error = null;
    } catch (err) {
        const { message } = err as Interfaces.JSONResponseError;
        error = message;
    }

    const dateFromFormatted = formatDateForAPI(dateFrom || '', 'from');
    const dateToFormatted = formatDateForAPI(dateTo || '', 'to');

    const swrKey = `/${searchType}?search=${encodeURIComponent(
        (Array.isArray(query) ? query[0] : query) || ''
    )}&type=${publicationTypes}&limit=${limit || '10'}&offset=${offset || '0'}${
        dateFromFormatted ? `&dateFrom=${dateFromFormatted}` : ''
    }${dateToFormatted ? `&dateTo=${dateToFormatted}` : ''}`;

    return {
        props: {
            searchType,
            query,
            publicationTypes,
            limit,
            offset,
            dateFrom,
            dateTo,
            fallback: {
                [swrKey]: searchResults
            },
            error
        }
    };
};

type Props = {
    searchType: Types.SearchType;
    query: string | null;
    publicationTypes: string | null;
    limit: string | null;
    offset: string | null;
    dateFrom: string | null;
    dateTo: string | null;
    error: string | null;
    fallback: { [key: string]: { data: Interfaces.PublicationVersion[] } & Interfaces.SearchResultMeta };
};

const Publications: Types.NextPage<Props> = (props): React.ReactElement => {
    const router = Router.useRouter();
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    // params
    const [query, setQuery] = React.useState(props.query ? props.query : '');
    const [publicationTypes, setPublicationTypes] = React.useState(props.publicationTypes || '');
    const [dateFrom, setDateFrom] = React.useState(props.dateFrom ? props.dateFrom : '');
    const [dateTo, setDateTo] = React.useState(props.dateTo ? props.dateTo : '');
    // param for pagination
    const [limit, setLimit] = React.useState(props.limit ? parseInt(props.limit, 10) : 10);
    const [offset, setOffset] = React.useState(props.offset ? parseInt(props.offset, 10) : 0);

    const dateFromFormatted = formatDateForAPI(dateFrom, 'from');
    const dateToFormatted = formatDateForAPI(dateTo, 'to');

    const swrKey = `/${props.searchType}?search=${encodeURIComponent(query || '')}&type=${
        publicationTypes || Config.values.publicationTypes.join(',')
    }&limit=${limit || '10'}&offset=${offset || '0'}${dateFromFormatted ? `&dateFrom=${dateFromFormatted}` : ''}${
        dateToFormatted ? `&dateTo=${dateToFormatted}` : ''
    }`;

    const {
        data: response,
        error,
        isValidating
    } = useSWR<Interfaces.SearchResults<Interfaces.PublicationVersion>>(swrKey, null, {
        fallback: props.fallback,
        use: [Helpers.laggy]
    });

    const handlerSearchFormSubmit: React.ReactEventHandler<HTMLFormElement> = async (
        e: React.SyntheticEvent<HTMLFormElement, Event>
    ): Promise<void> => {
        e.preventDefault();
        const searchTerm = searchInputRef.current?.value || '';

        await router.push(
            {
                query: {
                    ...router.query,
                    query: searchTerm
                }
            },
            undefined,
            { shallow: true }
        );

        setQuery(searchTerm);
    };

    const handleDateFormSubmit = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        e.preventDefault();
        const newDate = e.target.value;

        const [dateFrom, dateTo, setDate] =
            e.target.getAttribute('id') === 'date-from'
                ? [newDate, router.query.dateTo, setDateFrom]
                : [router.query.dateFrom, newDate, setDateTo];

        await router.push(
            {
                query: {
                    ...router.query,
                    dateTo,
                    dateFrom
                }
            },
            undefined,
            { shallow: true }
        );

        setDate(newDate);
    };

    const collatePublicationTypes = async (e: React.ChangeEvent<HTMLInputElement>, value: string): Promise<void> => {
        if (e.target.name === 'select-all') {
            await router.push(
                {
                    query: {
                        ...router.query,
                        type: value
                    }
                },
                undefined,
                { shallow: true }
            );

            return setPublicationTypes(value);
        }

        const current = publicationTypes ? publicationTypes.split(',') : [];
        const uniqueSet = new Set(current);
        e.target.checked ? uniqueSet.add(value) : uniqueSet.delete(value);
        const uniqueArray = Array.from(uniqueSet).join(',');

        await router.push(
            {
                query: {
                    ...router.query,
                    type: uniqueArray
                }
            },
            undefined,
            { shallow: true }
        );

        setPublicationTypes(uniqueArray);
    };

    const resetFilters = async (): Promise<void> => {
        await router.replace(router.route);

        setQuery('');
        searchInputRef.current && (searchInputRef.current.value = '');
        setOffset(0);
        setLimit(10);
        setPublicationTypes('');
        setDateFrom('');
        setDateTo('');
    };

    React.useEffect((): void => {
        setOffset(0);
    }, [query, publicationTypes, limit]);

    return (
        <>
            <Head>
                <title>{Config.urls.search.title}</title>
                <meta name="description" content={Config.urls.search.description} />
                <meta name="og:title" content={Config.urls.search.title} />
                <meta name="og:description" content={Config.urls.search.description} />
                <meta name="keywords" content={Config.urls.search.keywords.join(', ')} />
                <link rel="canonical" href={Config.urls.search.canonical} />
            </Head>

            <Layouts.Standard>
                <section className="container mx-auto px-8 py-8 lg:gap-4 lg:pb-0 lg:pt-16">
                    <Components.PageTitle text={`Search results ${query ? `for ${query}` : ''}`} />
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
                            <label htmlFor="query" className="relative block w-full">
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
                                    <SolidIcons.MagnifyingGlassIcon className="h-6 w-6 text-teal-500" />
                                </button>
                            </label>
                        </form>
                    </fieldset>

                    <aside className="relative col-span-3 hidden lg:block">
                        <Framer.AnimatePresence>
                            <Framer.motion.fieldset
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="sticky top-16 space-y-6 divide-y divide-grey-100"
                            >
                                <div className="space-y-5">
                                    <legend className="font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-50">
                                        Publication types
                                    </legend>
                                    <div className="space-y-3">
                                        {Config.values.publicationTypes.map((type) => (
                                            <div key={type} className={`relative flex items-start`}>
                                                <div className="flex h-5 items-center">
                                                    <input
                                                        id={type}
                                                        aria-describedby={type}
                                                        name={type}
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-grey-300 text-teal-600 outline-none transition-colors duration-150 hover:cursor-pointer focus:ring-yellow-500 disabled:text-grey-300 hover:disabled:cursor-not-allowed"
                                                        checked={
                                                            publicationTypes
                                                                ? publicationTypes.split(',').includes(type)
                                                                : false
                                                        }
                                                        onChange={(e) => collatePublicationTypes(e, type)}
                                                        disabled={!response}
                                                    />
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <label
                                                        htmlFor={type}
                                                        className="select-none font-medium text-grey-700 transition-colors duration-500 hover:cursor-pointer dark:text-white-50"
                                                        aria-disabled={!response}
                                                    >
                                                        {Helpers.formatPublicationType(type)}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="relative flex items-start border-b border-t border-grey-100 py-3">
                                            <div className="flex h-5 items-center">
                                                <input
                                                    id="select-all"
                                                    aria-describedby="select-all"
                                                    name="select-all"
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-grey-300 text-teal-600 outline-none transition-colors duration-150 hover:cursor-pointer focus:ring-yellow-500 disabled:text-grey-300 hover:disabled:cursor-not-allowed"
                                                    checked={Config.values.publicationTypes.every((type) =>
                                                        publicationTypes.includes(type)
                                                    )}
                                                    onChange={(e) =>
                                                        collatePublicationTypes(
                                                            e,
                                                            e.target.checked
                                                                ? Config.values.publicationTypes.join(',')
                                                                : ''
                                                        )
                                                    }
                                                    disabled={!response}
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label
                                                    htmlFor="select-all"
                                                    className="select-none font-medium italic text-grey-700 transition-colors duration-500 hover:cursor-pointer dark:text-white-50"
                                                    aria-disabled={!response}
                                                >
                                                    Select/deselect all
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <Framer.motion.form
                                        name="date-form"
                                        id="date-form"
                                        className="col-span-12 lg:col-span-3 xl:col-span-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <legend className="pb-4 font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-50">
                                            Date Range
                                        </legend>
                                        <label htmlFor="date-from" className="relative block w-full">
                                            <span className="mb-1 block text-xxs font-bold uppercase tracking-widest text-grey-600 transition-colors duration-500 dark:text-grey-300">
                                                Date From:
                                            </span>
                                            <input
                                                name="date-from"
                                                id="date-from"
                                                type="date"
                                                placeholder="Date from..."
                                                className="w-full rounded-md border border-grey-200 px-4 py-2 outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-70"
                                                disabled={isValidating}
                                                value={dateFrom}
                                                onChange={(e) => handleDateFormSubmit(e)}
                                            />
                                        </label>
                                        <label htmlFor="date-to" className="relative block w-full">
                                            <span className="mb-1 block pt-2 text-xxs font-bold uppercase tracking-widest text-grey-600 transition-colors duration-500 dark:text-grey-300">
                                                Date to:
                                            </span>
                                            <input
                                                name="date-to"
                                                id="date-to"
                                                type="date"
                                                placeholder="Date to..."
                                                className="w-full rounded-md border border-grey-200 px-4 py-2 outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-70"
                                                disabled={isValidating}
                                                value={dateTo}
                                                onChange={(e) => handleDateFormSubmit(e)}
                                            />
                                        </label>
                                    </Framer.motion.form>
                                </div>

                                <div className="pt-6">
                                    <button
                                        onClick={resetFilters}
                                        className="flex items-end rounded outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
                                    >
                                        <span className="mr-2 font-semibold leading-relaxed text-grey-800 underline decoration-teal-500 decoration-2 underline-offset-4 transition-colors duration-500 dark:text-white-50">
                                            Clear filters
                                        </span>
                                        <SolidIcons.XCircleIcon className="h-5 w-4 text-teal-500" />
                                    </button>
                                </div>
                            </Framer.motion.fieldset>
                        </Framer.AnimatePresence>
                    </aside>

                    <article className="col-span-12 min-h-screen lg:col-span-9">
                        {props.error ? (
                            <Components.Alert severity="ERROR" title={props.error} />
                        ) : (
                            <Framer.AnimatePresence>
                                {error && <Components.Alert severity="ERROR" title={error} />}

                                {!error && !response?.data?.length && !isValidating && (
                                    <Components.Alert
                                        severity="INFO"
                                        title="No results found"
                                        details={[
                                            'Try a different search criteria.',
                                            'If you think something is wrong, please contact the helpdesk.'
                                        ]}
                                    />
                                )}

                                {response?.data?.length && (
                                    <>
                                        <div className="rounded">
                                            {response.data.map((result, index: number) => {
                                                let classes = '';
                                                index === 0 ? (classes += 'rounded-t') : null;
                                                index === response.data.length - 1
                                                    ? (classes += '!border-b-transparent !rounded-b')
                                                    : null;

                                                return (
                                                    <Components.PublicationSearchResult
                                                        key={`publication-${index}-${result.id}`}
                                                        publicationVersion={result}
                                                        className={classes}
                                                    />
                                                );
                                            })}
                                        </div>

                                        {!isValidating && !!response.data.length && (
                                            <Components.Delay delay={response.data.length * 50}>
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
                                                                setOffset((prev) => prev - limit);
                                                                Helpers.scrollTopSmooth();
                                                            }}
                                                            disabled={offset === 0}
                                                            className="mr-6 rounded font-semibold text-grey-800 underline decoration-teal-500 decoration-2 underline-offset-4 outline-none transition-colors duration-500 focus:ring-2 focus:ring-yellow-500 disabled:decoration-teal-600 disabled:opacity-70 dark:text-white-50"
                                                        >
                                                            Previous
                                                        </button>

                                                        <button
                                                            onClick={(e) => {
                                                                setOffset((prev) => prev + limit);
                                                                Helpers.scrollTopSmooth();
                                                            }}
                                                            className="rounded font-semibold text-grey-800 underline decoration-teal-500 decoration-2 underline-offset-4 outline-none transition-colors duration-500 focus:ring-2 focus:ring-yellow-500 disabled:decoration-teal-600 disabled:opacity-70 dark:text-white-50"
                                                            disabled={limit + offset >= response.metadata.total}
                                                        >
                                                            Next
                                                        </button>
                                                    </div>
                                                    <span
                                                        data-testid="baz"
                                                        className="mt-4 block font-medium text-grey-800 transition-colors duration-500 dark:text-white-50"
                                                    >
                                                        Showing {offset + 1} -{' '}
                                                        {limit + offset > response.metadata.total
                                                            ? response.metadata.total
                                                            : limit + offset}{' '}
                                                        of {response.metadata.total}
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

export default Publications;
