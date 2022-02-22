import React from 'react';
import Head from 'next/head';
import useSWR from 'swr';
import * as Framer from 'framer-motion';
import * as Router from 'next/router';
import * as SolidIcons from '@heroicons/react/solid';

import * as Components from '@components';
import * as Interfaces from '@interfaces';
import * as Helpers from '@helpers';
import * as Layouts from '@layouts';
import * as Stores from '@stores';
import * as Config from '@config';
import * as Types from '@types';
import * as API from '@api';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    // defaults to possible query params
    let searchType: string | string[] | null = null;
    let query: string | string[] | null = null;
    let publicationTypes: string | string[] | null = null;
    let limit: number | string | string[] | null = null;
    let offset: number | string | string[] | null = null;
    let orderBy: string | string[] | null = null;
    let orderDirection: string | string[] | null = null;

    // defaults to results
    let results: Interfaces.Publication[] | Interfaces.User[] | [] = [];
    let metadata: Interfaces.SearchResultMeta | {} = {};

    // default error
    let error: string | null = 'No search type provided';

    // setting params
    if (context.query.query) query = context.query.query;
    if (context.query.for) searchType = context.query.for;
    if (context.query.type) publicationTypes = context.query.type;
    if (context.query.limit) limit = context.query.limit;
    if (context.query.offset) offset = context.query.offset;
    if (context.query.orderBy) orderBy = context.query.orderBy;
    if (context.query.orderDirection) orderDirection = context.query.orderDirection;

    // only if a search type is provided
    if (searchType) {
        // If multiple of the same params are provided, pick the first
        if (Array.isArray(searchType)) searchType = searchType[0];
        if (Array.isArray(query)) query = query[0];
        if (Array.isArray(publicationTypes)) publicationTypes = publicationTypes[0];
        if (Array.isArray(limit)) limit = limit[0];
        if (Array.isArray(offset)) offset = offset[0];
        if (Array.isArray(orderBy)) orderBy = orderBy[0];
        if (Array.isArray(orderDirection)) orderDirection = orderDirection[0];

        // params come in as strings, so make sure the value of the string is parsable as a number or ignore it
        limit && parseInt(limit, 10) !== NaN ? (limit = parseInt(limit, 10)) : (limit = null);
        offset && parseInt(offset, 10) !== NaN ? (offset = parseInt(offset, 10)) : (offset = null);

        // ensure the strings provided for ordering are as we expect them to be, else ignore them
        orderBy && ['createdAt', 'updatedAt'].includes(orderBy) ? null : (orderBy = null);
        orderDirection && ['asc', 'desc'].includes(orderDirection) ? null : (orderDirection = null);

        // ensure the value of the seach type is acceptable
        if (searchType === 'publications' || searchType === 'users') {
            try {
                const response = await API.search(
                    searchType,
                    query,
                    publicationTypes,
                    limit,
                    offset,
                    orderBy as Types.OrderBySearchOption, // to please ts, we must tom hanks it, even though we can be sure of the value
                    orderDirection as Types.OrderDirectionSearchOption // to please ts, we must tom hanks it, even though we can be sure of the value
                );
                results = response.data;
                metadata = response.metadata;
                error = null;
            } catch (err) {
                const { message } = err as Interfaces.JSONResponseError;
                error = message;
            }
        }
    }

    const swrKey = `/${searchType}?search=${query || ''}${
        searchType === 'publications' ? `&type=${publicationTypes}` : ''
    }&limit=${limit || '10'}&offset=${offset || '0'}&orderBy=${orderBy || 'createdAt'}&orderDirection=${
        orderDirection || 'asc'
    }`;

    return {
        props: {
            searchType,
            query,
            publicationTypes,
            limit,
            offset,
            orderBy,
            orderDirection,
            fallback: {
                [swrKey]: results
            }
        }
    };
};

type Props = {
    searchType: Types.SearchType | string | undefined;
    query: string | null;
    publicationTypes: string | null;
    limit: string | null;
    offset: string | null;
    orderBy: string | null;
    orderDirection: string | null;
};

const Search: Types.NextPage<Props> = (props): JSX.Element => {
    const router = Router.useRouter();
    const showCmdPalette = Stores.useGlobalsStore((state: Types.GlobalsStoreType) => state.showCmdPalette);
    const toggleCmdPalette = Stores.useGlobalsStore((state: Types.GlobalsStoreType) => state.toggleCmdPalette);
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    // params
    const [searchType, setSearchType] = React.useState(props.searchType ? props.searchType : 'publications');
    const [query, setQuery] = React.useState(props.query ? props.query : '');
    const [publicationTypes, setPublicationTypes] = React.useState(
        props.publicationTypes ? props.publicationTypes : Config.values.publicationTypes.join(',')
    );
    // param for pagination
    const [limit, setLimit] = React.useState(props.limit ? parseInt(props.limit, 10) : 10);
    const [offset, setOffset] = React.useState(props.offset ? parseInt(props.offset, 10) : 0);
    const [orderBy, setOrderBy] = React.useState(props.orderBy ? props.orderBy : 'updatedAt');
    const [orderDirection, setOrderDirection] = React.useState(props.orderDirection ? props.orderDirection : 'asc');

    // ugly complex swr key
    const swrKey = `/${searchType}?search=${query || ''}${
        searchType === 'publications' ? `&type=${publicationTypes}` : ''
    }&limit=${limit || '10'}&offset=${offset || '0'}&orderBy=${orderBy || 'createdAt'}&orderDirection=${
        orderDirection || 'asc'
    }`;

    const { data: { data: results = [] } = {}, error, isValidating } = useSWR(swrKey);

    const handlerSearchFormSubmit: React.ReactEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const searchTerm = searchInputRef.current?.value || '';
        setQuery(searchTerm);
    };

    const collatePublicationTypes = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
        const current = publicationTypes ? publicationTypes.split(',') : [];
        const uniqueSet = new Set(current);
        e.target.checked ? uniqueSet.add(value) : uniqueSet.delete(value);
        const uniqueArray = Array.from(uniqueSet).join(',');

        router.push({ pathname: '/search', query: { for: searchType, type: uniqueArray } }, undefined, {
            shallow: true
        });

        setPublicationTypes(uniqueArray ? uniqueArray : Config.values.publicationTypes.join(','));
    };

    const handleChangeSearchType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === 'users') {
            const paramsListCopy = { ...router.query };
            if (Object.prototype.hasOwnProperty.call(paramsListCopy, 'type')) delete paramsListCopy.type;
            router.push({ query: { ...paramsListCopy, for: value } }, undefined, { shallow: true });
        }
        if (value === 'publications') {
            router.push(
                {
                    query: { ...router.query, for: value, type: publicationTypes, query: searchInputRef.current?.value }
                },
                undefined,
                { shallow: true }
            );
        }
        setOrderBy('updatedAt');
        setQuery('');
        searchInputRef.current && (searchInputRef.current.value = '');
        setSearchType(e.target.value);
    };

    const resetFilters = (e: React.MouseEvent<HTMLButtonElement>) => {
        setQuery('');
        searchInputRef.current && (searchInputRef.current.value = '');
        setOrderBy('updatedAt');
        setOrderDirection('asc');
        setOffset(0);
        setLimit(10);
        if (searchType === 'publications') setPublicationTypes(Config.values.publicationTypes.join(','));
    };

    React.useEffect(() => {
        setOffset(0);
    }, [searchType, query, publicationTypes, limit, orderBy, orderDirection]);

    return (
        <>
            <Head>
                <meta name="robots" content="noindex" />
                <meta name="description" content="" />
                <meta name="keywords" content="" />
                <link rel="canonical" href={`${Config.urls.search.canonical}`} />
                <title>{Config.urls.search.title}</title>
            </Head>

            <Layouts.Standard fixedHeader={true}>
                <Components.SectionTwo
                    className="bg-teal-50 dark:bg-grey-800"
                    waveFillTop="fill-teal-100 dark:fill-grey-500 transition-colors duration-500"
                    waveFillMiddle="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                    waveFillBottom="fill-teal-700 dark:fill-grey-800 transition-colors duration-500"
                >
                    <section className="container mx-auto px-8 py-8 lg:gap-4 lg:pt-36 lg:pb-0">
                        <Components.PageTitle text={`Search results ${query ? `for ${query}` : ''}`} />
                    </section>
                    <section
                        id="content"
                        className="container mx-auto grid grid-cols-1 px-8 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-8"
                    >
                        <fieldset className="col-span-12 mb-8 grid w-full grid-cols-12 items-end gap-y-4 gap-x-6 lg:mb-0 lg:gap-x-6 2xl:gap-x-10">
                            <legend className="sr-only">Search options</legend>

                            <label htmlFor="search-type" className="relative col-span-12 block lg:col-span-3">
                                <span className="mb-1 block text-xxs font-bold uppercase tracking-widest text-grey-600 transition-colors duration-500 dark:text-grey-300">
                                    Searching
                                </span>
                                <select
                                    name="search-type"
                                    id="search-type"
                                    onChange={handleChangeSearchType}
                                    value={searchType}
                                    className="col-span-3 !mt-0 block w-full rounded-md border border-grey-200 outline-none focus:ring-2 focus:ring-yellow-500"
                                    disabled={isValidating}
                                >
                                    <option value="publications">Publications</option>
                                    <option value="users">Authors</option>
                                </select>
                            </label>

                            <label htmlFor="order-by" className="relative col-span-12 block lg:col-span-2">
                                <span className="mb-1 block text-xxs font-bold uppercase tracking-widest text-grey-600 transition-colors duration-500 dark:text-grey-300">
                                    Ordering
                                </span>
                                <select
                                    name="order-by"
                                    id="order-by"
                                    onChange={(e) => setOrderBy(e.target.value)}
                                    value={orderBy}
                                    className="col-span-2 block w-full rounded-md border border-grey-200 outline-none focus:ring-2 focus:ring-yellow-500"
                                    disabled={isValidating}
                                >
                                    <option value="updatedAt">Date updated</option>
                                    <option value="createdAt">Date created</option>
                                    {searchType === 'publications' && <option value="title">Publication title</option>}
                                    {searchType === 'users' && <option value="firstName">First name</option>}
                                    {searchType === 'users' && <option value="lastName">Last name</option>}
                                </select>
                            </label>

                            <label htmlFor="order-direction" className="relative col-span-8 block lg:col-span-2">
                                <span className="mb-1 block text-xxs font-bold uppercase tracking-widest text-grey-600 transition-colors duration-500 dark:text-grey-300">
                                    Direction
                                </span>
                                <select
                                    name="order-direction"
                                    id="order-direction"
                                    onChange={(e) => setOrderDirection(e.target.value)}
                                    value={orderDirection}
                                    className="w-full rounded-md border border-grey-200 outline-none focus:ring-2 focus:ring-yellow-500"
                                    disabled={isValidating}
                                >
                                    <option value="asc">Ascending</option>
                                    <option value="desc">Descending</option>
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
                                className="col-span-12 lg:col-span-3 xl:col-span-4"
                                onSubmit={handlerSearchFormSubmit}
                            >
                                <label htmlFor="search-query" className="relative w-full" tabIndex={1}>
                                    <span className="mb-1 block text-xxs font-bold uppercase tracking-widest text-grey-600 transition-colors duration-500 dark:text-grey-300">
                                        Quick search
                                    </span>
                                    <input
                                        ref={searchInputRef}
                                        autoFocus
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
                                        className="absolute right-px rounded-md p-2 outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-70"
                                        disabled={isValidating}
                                    >
                                        <SolidIcons.SearchIcon className="h-6 w-6 text-teal-500" />
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
                                    className="sticky top-28 space-y-5"
                                >
                                    <legend className="font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white">
                                        Publication types
                                    </legend>
                                    {Config.values.publicationTypes.map((type) => (
                                        <div
                                            key={type}
                                            className={`relative flex items-start ${
                                                searchType !== 'publications' && 'opacity-50'
                                            }`}
                                        >
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
                                                    disabled={!results || searchType !== 'publications'}
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label
                                                    htmlFor={type}
                                                    className="select-none font-medium text-grey-700 transition-colors duration-500 hover:cursor-pointer dark:text-white"
                                                    aria-disabled={!results || searchType !== 'publications'}
                                                >
                                                    {Helpers.formatPublicationType(type)}
                                                </label>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        onClick={resetFilters}
                                        className="!mt-8 flex items-end rounded outline-none focus:ring-2 focus:ring-yellow-500"
                                    >
                                        <span className="mr-2 font-semibold leading-relaxed text-grey-800 underline decoration-teal-500 decoration-2 underline-offset-4 transition-colors duration-500 dark:text-white">
                                            Clear filters
                                        </span>
                                        <SolidIcons.XCircleIcon className="h-5 w-4 text-teal-500" />
                                    </button>
                                </Framer.motion.fieldset>
                            </Framer.AnimatePresence>
                        </aside>

                        <article className="col-span-9 min-h-screen">
                            <Framer.AnimatePresence>
                                {!!error && (
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
                                        details={['Placeholder support text here', 'Placeholder support text here']}
                                    />
                                )}

                                {!error && !isValidating && !!results?.data && (
                                    <>
                                        {results.data.map((result: any, index: number) => {
                                            let classes = '';
                                            index === 0 ? (classes += 'rounded-t-lg ') : null;
                                            index === results.data.length - 1 ? (classes += 'rounded-b-lg') : null;

                                            if (searchType === 'publications') {
                                                return (
                                                    <Components.Delay key={result.id} delay={index * 50}>
                                                        <Components.PublicationSearchResult
                                                            id={result.id}
                                                            title={result.title}
                                                            createdBy={`${result?.user?.firstName}. ${result?.user?.lastName}`}
                                                            type={result.type}
                                                            date={result.updatedAt}
                                                            className={classes}
                                                        />
                                                    </Components.Delay>
                                                );
                                            }
                                            if (searchType === 'users') {
                                                return (
                                                    <Components.Delay key={result.id} delay={index * 50}>
                                                        <Components.UserSearchResult
                                                            user={result}
                                                            className={classes}
                                                        />
                                                    </Components.Delay>
                                                );
                                            }
                                        })}

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
                                                            className="mr-6 rounded font-semibold text-grey-800 underline decoration-teal-500 decoration-2 underline-offset-4 outline-none transition-colors duration-500 focus:ring-2 focus:ring-yellow-500 disabled:decoration-teal-600 disabled:opacity-70 dark:text-white"
                                                        >
                                                            Previous
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                setOffset((prev) => prev + limit);
                                                            }}
                                                            className="rounded font-semibold text-grey-800 underline decoration-teal-500 decoration-2 underline-offset-4 outline-none transition-colors duration-500 focus:ring-2 focus:ring-yellow-500 disabled:decoration-teal-600 disabled:opacity-70 dark:text-white"
                                                            disabled={limit + offset > results.metadata.total}
                                                        >
                                                            Next
                                                        </button>
                                                    </div>
                                                    <span className="mt-4 block font-medium text-grey-800 transition-colors duration-500 dark:text-white">
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
                        </article>
                    </section>
                </Components.SectionTwo>
            </Layouts.Standard>
        </>
    );
};

export default Search;
