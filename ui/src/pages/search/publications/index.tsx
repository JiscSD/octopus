import Head from 'next/head';
import React from 'react';
import useSWR from 'swr';
import * as Framer from 'framer-motion';
import * as Router from 'next/router';
import * as SolidIcons from '@heroicons/react/24/solid';

import * as api from '@/api';
import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as Interfaces from '@/interfaces';
import * as Layouts from '@/layouts';
import * as Types from '@/types';

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

const constructQueryParams = (params: {
    [key in 'query' | 'publicationTypes' | 'limit' | 'offset' | 'dateFrom' | 'dateTo' | 'authorTypes']: string | null;
}): string => {
    const { query, publicationTypes, limit, offset, dateFrom, dateTo, authorTypes } = params;
    const paramString: string[] = [];

    if (query) {
        paramString.push('search=' + encodeURIComponent(query));
    }

    if (publicationTypes) {
        // filter valid publication types only
        paramString.push(
            'type=' +
                publicationTypes
                    .split(',')
                    .filter((type) => Config.values.publicationTypes.includes(type as Types.PublicationType))
                    .join(',')
        );
    }

    // params come in as strings, so make sure the value of the string is parsable as a number or ignore it
    if (limit && !Number.isNaN(parseInt(limit, 10))) {
        paramString.push('limit=' + limit);
    }
    if (offset && !Number.isNaN(parseInt(offset, 10))) {
        paramString.push('offset=' + offset);
    }

    if (dateFrom) {
        const dateFromFormatted = formatDateForAPI(dateFrom || '', 'from');
        if (dateFromFormatted) {
            paramString.push('dateFrom=' + dateFromFormatted);
        }
    }

    if (dateTo) {
        const dateToFormatted = formatDateForAPI(dateTo || '', 'to');
        if (dateToFormatted) {
            paramString.push('dateTo=' + dateToFormatted);
        }
    }

    if (authorTypes) {
        paramString.push(
            'authorType=' +
                authorTypes
                    .split(',')
                    .filter((type) => Config.values.authorTypes.includes(type))
                    .join(',')
        );
    }

    return paramString.join('&');
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
    let authorTypes: string | string[] | null = null;

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
    if (context.query.authorType) authorTypes = context.query.authorType;

    if (Array.isArray(query)) query = query[0];
    if (Array.isArray(publicationTypes)) publicationTypes = publicationTypes[0];
    if (Array.isArray(limit)) limit = limit[0];
    if (Array.isArray(offset)) offset = offset[0];
    if (Array.isArray(dateFrom)) dateFrom = dateFrom[0];
    if (Array.isArray(dateTo)) dateTo = dateTo[0];
    if (Array.isArray(authorTypes)) authorTypes = authorTypes[0];

    const params = constructQueryParams({
        query,
        publicationTypes,
        limit,
        offset,
        dateFrom,
        dateTo,
        authorTypes
    });

    const swrKey = `/${searchType}?${params}`;
    let fallbackData: Interfaces.SearchResults<Interfaces.PublicationVersion> = {
        data: [],
        metadata: {
            offset: 0,
            limit: 10,
            total: 0
        }
    };

    try {
        fallbackData = (await api.get(swrKey)).data;
    } catch (err) {
        const { message } = err as Interfaces.JSONResponseError;
        error = message;
    }

    return {
        props: {
            searchType,
            query,
            publicationTypes,
            limit,
            offset,
            dateFrom,
            dateTo,
            authorTypes,
            fallback: {
                [swrKey]: fallbackData
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
    authorTypes: string | null;
    error: string | null;
    fallback: { [key: string]: { data: Interfaces.PublicationVersion[] } & Interfaces.SearchResultMeta };
};

const Publications: Types.NextPage<Props> = (props): React.ReactElement => {
    const router = Router.useRouter();
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    // params
    const [query, setQuery] = React.useState(props.query ? props.query : '');
    const [authorTypes, setAuthorTypes] = React.useState(props.authorTypes || '');
    const [publicationTypes, setPublicationTypes] = React.useState(props.publicationTypes || '');
    const [dateFrom, setDateFrom] = React.useState(props.dateFrom ? props.dateFrom : '');
    const [dateTo, setDateTo] = React.useState(props.dateTo ? props.dateTo : '');
    // param for pagination
    const [limit, setLimit] = React.useState(props.limit ? parseInt(props.limit, 10) : 10);
    const [offset, setOffset] = React.useState(props.offset ? parseInt(props.offset, 10) : 0);

    const params = constructQueryParams({
        query,
        publicationTypes,
        limit: limit.toString(),
        offset: offset.toString(),
        dateFrom,
        dateTo,
        authorTypes
    });

    const swrKey = `/${props.searchType}?${params}`;

    const {
        data: response,
        error,
        isValidating
    } = useSWR<Interfaces.SearchResults<Interfaces.PublicationVersion>>(swrKey, null, {
        fallback: props.fallback,
        use: [Helpers.laggy]
    });

    const handleSearchFormSubmit: React.ReactEventHandler<HTMLFormElement> = async (
        e: React.SyntheticEvent<HTMLFormElement, Event>
    ): Promise<void> => {
        e.preventDefault();
        const searchTerm = e.currentTarget.searchTerm.value;
        const newQuery = { ...router.query, query: searchTerm };

        if (!searchTerm) {
            delete newQuery.query; // remove query param from browser url
        }

        await router.push({ query: newQuery }, undefined, { shallow: true });
        setOffset(0);
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

    const collateAuthorTypes = async (e: React.ChangeEvent<HTMLInputElement>, value: string): Promise<void> => {
        const current = authorTypes ? authorTypes.split(',') : [];
        const uniqueSet = new Set(current);
        e.target.checked ? uniqueSet.add(value) : uniqueSet.delete(value);
        const uniqueArray = Array.from(uniqueSet).join(',');

        await router.push(
            {
                query: {
                    ...router.query,
                    authorType: uniqueArray
                }
            },
            undefined,
            { shallow: true }
        );

        setAuthorTypes(uniqueArray);
    };

    const collatePublicationTypes = async (e: React.ChangeEvent<HTMLInputElement>, value: string): Promise<void> => {
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
        setAuthorTypes('');
    };

    React.useEffect((): void => {
        setOffset(0);
    }, [query, publicationTypes, limit]);

    const checkBoxClasses =
        'h-4 w-4 rounded border-grey-300 text-teal-600 outline-none transition-colors duration-150 hover:cursor-pointer focus:ring-yellow-500 disabled:text-grey-300 hover:disabled:cursor-not-allowed';

    const filters = (
        <>
            <fieldset className="space-y-3">
                <legend className="pb-2 font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-50">
                    Author types
                </legend>
                {Config.values.authorTypes.map((type) => (
                    <div key={type} className={`flex items-center`}>
                        <input
                            id={type}
                            name={type}
                            type="checkbox"
                            className={checkBoxClasses}
                            checked={authorTypes ? authorTypes.split(',').includes(type) : false}
                            onChange={(e) => collateAuthorTypes(e, type)}
                            disabled={!response}
                        />
                        <label
                            htmlFor={type}
                            className="ml-3 text-sm select-none font-medium text-grey-700 transition-colors duration-500 hover:cursor-pointer dark:text-white-50"
                            aria-disabled={!response}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </label>
                    </div>
                ))}
            </fieldset>
            <fieldset className="space-y-3">
                <legend className="pb-2 font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-50">
                    Publication types
                </legend>
                {Config.values.publicationTypes.map((type) => (
                    <div key={type} className={`flex items-center`}>
                        <input
                            id={type}
                            name={type}
                            type="checkbox"
                            className={checkBoxClasses}
                            checked={publicationTypes ? publicationTypes.split(',').includes(type) : false}
                            onChange={(e) => collatePublicationTypes(e, type)}
                            disabled={!response}
                        />
                        <label
                            htmlFor={type}
                            className="ml-3 text-sm select-none font-medium text-grey-700 transition-colors duration-500 hover:cursor-pointer dark:text-white-50"
                            aria-disabled={!response}
                        >
                            {Helpers.formatPublicationType(type)}
                        </label>
                    </div>
                ))}

                <div className="flex items-center border-b border-t border-grey-100 py-3">
                    <input
                        id="select-all"
                        aria-describedby="select-all"
                        name="select-all"
                        type="checkbox"
                        className={checkBoxClasses}
                        checked={Config.values.publicationTypes.every((type) => publicationTypes.includes(type))}
                        onChange={(e) =>
                            setPublicationTypes(e.target.checked ? Config.values.publicationTypes.join(',') : '')
                        }
                        disabled={!response}
                    />
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
            </fieldset>
            <fieldset className="col-span-12 lg:col-span-3 xl:col-span-4 space-y-3">
                <legend className="pb-2 font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-50">
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
            </fieldset>
        </>
    );

    return (
        <>
            <Head>
                <title>{Config.urls.searchPublications.title}</title>
                <meta name="description" content={Config.urls.searchPublications.description} />
                <meta name="og:title" content={Config.urls.searchPublications.title} />
                <meta name="og:description" content={Config.urls.searchPublications.description} />
                <meta name="keywords" content={Config.urls.searchPublications.keywords.join(', ')} />
                <link rel="canonical" href={Config.urls.searchPublications.canonical} />
            </Head>

            <Layouts.Standard>
                <Components.SearchPage
                    error={error || props.error}
                    filters={filters}
                    handleSearchFormSubmit={handleSearchFormSubmit}
                    isValidating={isValidating}
                    limit={limit}
                    offset={offset}
                    query={query}
                    ref={searchInputRef}
                    resetFilters={resetFilters}
                    results={response?.data || []}
                    searchType="publication-versions"
                    setLimit={setLimit}
                    setOffset={setOffset}
                    total={response?.metadata.total || 0}
                />
            </Layouts.Standard>
        </>
    );
};

export default Publications;
