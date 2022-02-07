import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import * as Framer from 'framer-motion';
import * as Router from 'next/router';
import * as SolidIcons from '@heroicons/react/solid';

import * as Components from '@components';
import * as Interfaces from '@interfaces';
import * as Helpers from '@helpers';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Mocks from '@mocks';
import * as Types from '@types';
import * as API from '@api';

export const getServerSideProps: GetServerSideProps = async (context) => {
    // defaults to possible query params
    let searchType: string | string[] | null = null;
    let query: string | string[] | null = null;
    let publicationType: string | string[] | null = null;
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
    if (context.query.type) publicationType = context.query.type;
    if (context.query.limit) limit = context.query.limit;
    if (context.query.offset) offset = context.query.offset;
    if (context.query.orderBy) orderBy = context.query.orderBy;
    if (context.query.orderDirection) orderDirection = context.query.orderDirection;

    // only if a search type is provided
    if (searchType) {
        // If multiple of the same params are provided, pick the first
        if (Array.isArray(searchType)) searchType = searchType[0];
        if (Array.isArray(query)) query = query[0];
        if (Array.isArray(publicationType)) publicationType = publicationType[0];
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
                    publicationType,
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

    return {
        props: {
            searchType,
            query,
            publicationType,
            results,
            metadata,
            error
        }
    };
};

type Props = {
    searchType: Types.SearchType | string | undefined;
    query: string | null;
    publicationType: string | null;
    results: Interfaces.Publication[] | Interfaces.User[];
    metadata: Interfaces.SearchResultMeta;
    error: string | null;
};

const Search: NextPage<Props> = (props): JSX.Element => {
    const router = Router.useRouter();
    const searchInputRef = React.useRef<HTMLInputElement | any>();
    const [loading, setLoading] = React.useState(false);
    const [searchType, setSearchType] = React.useState(props.searchType ? props.searchType : 'publications');
    const [query, setQuery] = React.useState(props.query);
    const [publicationTypes, setPublicationTypes] = React.useState(props.publicationType);
    const [results, setResutls] = React.useState(props.results);
    const [metadata, setMetadata] = React.useState(props.metadata);
    const [error, setError] = React.useState(props.error);

    const updateResults = async () => {
        setLoading(true);

        router.push({
            query: {
                ...router.query,
                query
            }
        });

        try {
            const response = await API.search(searchType, searchInputRef.current.value, publicationTypes);
            setError(null);
            setResutls(response.data);
        } catch (err) {
            const { message } = err as Interfaces.JSONResponseError;
            setError(message);
            console.log(err);
        }

        setLoading(false);
    };

    const collatePublicationTypes = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
        const current = publicationTypes ? publicationTypes.split(',') : [];
        const uniqueSet = new Set(current);
        e.target.checked ? uniqueSet.add(value) : uniqueSet.delete(value);
        const uniqueArray = Array.from(uniqueSet).join(',');

        router.push({
            query: {
                for: searchType,
                type: uniqueArray
            }
        });

        setPublicationTypes(uniqueArray);
    };

    React.useEffect(() => {
        if (searchType === 'users') {
            const paramsListCopy = { ...router.query };
            if (paramsListCopy.hasOwnProperty('type')) delete paramsListCopy.type;

            router.push({
                query: { ...paramsListCopy, for: searchType }
            });
        }
        if (searchType === 'publications') {
            router.push({
                query: {
                    ...router.query,
                    for: searchType,
                    type: publicationTypes,
                    query: searchInputRef.current.value
                }
            });
        }
    }, [searchType]);

    React.useEffect(() => {
        if (!loading) searchInputRef.current.focus();
    }, [loading]);

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
                        <Components.PageTitle text={`Search results ${props.query ? `for ${props.query}` : ''}`} />
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
                                    onChange={(e) => setSearchType(e.target.value)}
                                    value={searchType}
                                    className="!mt-0 w-full rounded-md border-transparent outline-none focus:ring-2 focus:ring-yellow-500"
                                    disabled={loading}
                                >
                                    <option value="publications">Publications</option>
                                    <option value="users">Authors</option>
                                </select>
                            </fieldset>
                            <form
                                name="query-form"
                                id="query-form"
                                className="col-span-12 flex justify-end lg:col-span-9"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    updateResults();
                                }}
                            >
                                <label
                                    htmlFor="search-query"
                                    className="2xl:1/3 flex w-full items-center lg:w-2/3 xl:w-1/2"
                                    tabIndex={1}
                                >
                                    <input
                                        ref={searchInputRef}
                                        name="query"
                                        id="query"
                                        onChange={(e) => setQuery(e.target.value)}
                                        defaultValue={query ? query : ''}
                                        type="text"
                                        placeholder="Quick search..."
                                        className="w-full rounded-l-md border-none px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-500"
                                        disabled={loading}
                                    />
                                    <button
                                        type="submit"
                                        form="query-form"
                                        className="rounded-r-md border-none bg-white p-3 outline-none focus:ring-2 focus:ring-yellow-500"
                                    >
                                        <SolidIcons.SearchIcon className="h-6 w-6 text-teal-500" />
                                    </button>
                                </label>
                            </form>
                        </div>

                        <aside className="relative col-span-3 hidden lg:block">
                            <Framer.AnimatePresence>
                                {searchType === 'publications' && (
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
                                            <div key={type} className="relative flex items-start">
                                                <div className="flex h-5 items-center">
                                                    <input
                                                        id={type}
                                                        aria-describedby={type}
                                                        name={type}
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-grey-300 text-teal-600 outline-none transition-colors duration-150 hover:cursor-pointer focus:ring-yellow-500 disabled:text-grey-300"
                                                        checked={
                                                            publicationTypes
                                                                ? publicationTypes.split(',').includes(type)
                                                                : false
                                                        }
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                            collatePublicationTypes(e, type)
                                                        }
                                                        disabled={loading}
                                                    />
                                                </div>
                                                <div className="ml-3 text-sm">
                                                    <label
                                                        htmlFor={type}
                                                        className="select-none font-medium text-grey-700 transition-colors duration-500 hover:cursor-pointer dark:text-white"
                                                    >
                                                        {Helpers.formatPublicationType(type)}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </Framer.motion.fieldset>
                                )}
                            </Framer.AnimatePresence>
                        </aside>

                        <article className="col-span-9">
                            {!loading && !error && results.length ? (
                                <>
                                    {props.results.map((result: any) => {
                                        if (searchType === 'publications') {
                                            return (
                                                <Components.PublicationSearchResult
                                                    key={result.id}
                                                    id={result.id}
                                                    title={result.title}
                                                    createdBy={`${result?.user?.firstName}. ${result?.user?.lastName}`}
                                                    type={result.type}
                                                    date={result.updatedAt}
                                                />
                                            );
                                        }
                                        if (searchType === 'users') {
                                            return <Components.UserSearchResult key={result.id} id={result.id} />;
                                        }
                                    })}

                                    <div className="mt-6 empty:hidden">
                                        {results.length > 5 && <Components.Pagination metadata={metadata} />}
                                    </div>
                                </>
                            ) : null}
                            {!loading && !error && !results.length && (
                                <Components.Alert
                                    severity="INFO"
                                    title="Sorry, there are no results for your search request"
                                />
                            )}
                            {loading && <p>loading state</p>}
                            {!loading && error && (
                                <Components.Alert
                                    severity="ERROR"
                                    title="There was a problem fetching results"
                                    details={[error]}
                                />
                            )}
                        </article>
                    </section>
                </Components.SectionTwo>
            </Layouts.Standard>
        </>
    );
};

export default Search;
