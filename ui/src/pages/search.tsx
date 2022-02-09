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
        setQuery('');
        searchInputRef.current && (searchInputRef.current.value = '');
        setSearchType(e.target.value);
    };

    return (
        <>
            <Head>
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
                    <section className="container mx-auto px-8 py-8 lg:gap-4 lg:pt-36">
                        <Components.PageTitle text={`Search results ${query ? `for ${query}` : ''}`} />
                    </section>
                    <section
                        id="content"
                        className="container mx-auto grid grid-cols-1 px-8 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-8"
                    >
                        <div className="col-span-12 grid w-full grid-cols-12 gap-y-4 lg:gap-x-12">
                            <fieldset className="col-span-12 flex items-center lg:col-span-3">
                                <legend className="sr-only">Search for</legend>
                                <select
                                    name="search-type"
                                    id="search-type"
                                    onChange={handleChangeSearchType}
                                    value={searchType}
                                    className="!mt-0 w-full rounded-md border border-grey-200 outline-none focus:ring-2 focus:ring-yellow-500"
                                    disabled={!results}
                                >
                                    <option value="publications">Publications</option>
                                    <option value="users">Authors</option>
                                </select>
                            </fieldset>
                            <form
                                name="query-form"
                                id="query-form"
                                className="col-span-12 flex justify-end lg:col-span-9"
                                onSubmit={handlerSearchFormSubmit}
                            >
                                <label
                                    htmlFor="search-query"
                                    className="2xl:1/3 relative flex w-full items-center lg:w-2/3 xl:w-1/2"
                                    tabIndex={1}
                                >
                                    <input
                                        ref={searchInputRef}
                                        autoFocus
                                        name="query"
                                        id="query"
                                        defaultValue={props.query ? props.query : ''}
                                        type="text"
                                        placeholder="Quick search..."
                                        className="w-full rounded-md border border-grey-200 px-4 py-2 outline-none focus:ring-2 focus:ring-yellow-500"
                                        disabled={!results}
                                    />
                                    <button
                                        type="submit"
                                        form="query-form"
                                        className="absolute right-px rounded-md bg-white p-2 outline-none focus:ring-2 focus:ring-yellow-500"
                                    >
                                        <SolidIcons.SearchIcon className="h-6 w-6 text-teal-500" />
                                    </button>
                                </label>
                            </form>
                        </div>

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
                                </Framer.motion.fieldset>
                            </Framer.AnimatePresence>
                        </aside>

                        <article className="col-span-9 min-h-screen">
                            <Framer.AnimatePresence>
                                {!!error && (
                                    <Components.Alert
                                        severity="ERROR"
                                        title={error}
                                        details={['Please refer to our support page']}
                                    />
                                )}

                                {!error && !results?.data?.length && !isValidating && (
                                    <Components.Alert
                                        severity="INFO"
                                        title="No results found"
                                        details={[
                                            'Some helpfuls informaiton here',
                                            'Some more helpful information here'
                                        ]}
                                    />
                                )}

                                {!error && !isValidating && !!results?.data && (
                                    <div className="mt-8 lg:mt-0">
                                        {/* <div className="mt-6 empty:hidden">
                                            {!!results?.metadata && !!results?.data.length && (
                                                <Components.Pagination
                                                    current={Math.ceil(offset / limit + 1)}
                                                    limit={limit}
                                                    total={parseInt(results.metadata.total, 10)}
                                                />
                                            )}
                                        </div> */}

                                        {results?.data.map((result: any, index: number) => {
                                            let classes = '';
                                            index === 0 ? (classes += 'rounded-t-lg ') : null;
                                            index === results.data.length - 1 ? (classes += 'rounded-b-lg') : null;

                                            if (searchType === 'publications') {
                                                return (
                                                    <Components.Delay delay={index * 50}>
                                                        <Components.PublicationSearchResult
                                                            key={result.id}
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
                                                    <Components.Delay delay={index * 50}>
                                                        <Components.UserSearchResult
                                                            key={result.id}
                                                            user={result}
                                                            className={classes}
                                                        />
                                                    </Components.Delay>
                                                );
                                            }
                                        })}
                                    </div>
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
