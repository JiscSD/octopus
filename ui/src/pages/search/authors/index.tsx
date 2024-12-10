import React from 'react';
import useSWR from 'swr';
import Head from 'next/head';

import * as Router from 'next/router';
import * as Interfaces from '@/interfaces';
import * as Components from '@/components';
import * as Layouts from '@/layouts';
import * as Config from '@/config';
import * as Types from '@/types';
import * as api from '@/api';
import * as Helpers from '@/helpers';

const baseEndpoint = '/users?role=USER';

/**
 *
 * @TODO - refactor getServerSideProps
 * remove unnecessary if statements
 */

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const searchType: Types.SearchType = 'authors';
    let query: string | string[] | null = null;
    let limit: number | string | string[] | null = null;
    let offset: number | string | string[] | null = null;

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

    const swrKey = `${baseEndpoint}&search=${encodeURIComponent(query || '')}&limit=${limit || '10'}&offset=${offset || '0'}`;
    let fallbackData: Interfaces.SearchResults<Interfaces.User> = {
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
            limit,
            offset,
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
    limit: string | null;
    offset: string | null;
    fallback: {
        [swrKey: string]: Interfaces.CoreUser[];
    };
    error: string | null;
};

const Authors: Types.NextPage<Props> = (props): React.ReactElement => {
    const router = Router.useRouter();
    // Query params
    const { query = '' } = router.query as Interfaces.AuthorSearchQuery;
    const [limit, setLimit] = React.useState(props.limit ? parseInt(props.limit, 10) : 10);
    const [offset, setOffset] = React.useState(props.offset ? parseInt(props.offset, 10) : 0);

    const swrKey = `${baseEndpoint}&search=${encodeURIComponent(query || '')}&limit=${limit || '10'}&offset=${offset || '0'}`;

    const {
        data: results,
        error,
        isValidating
    } = useSWR<Interfaces.SearchResults<Interfaces.User>>(swrKey, {
        fallback: props.fallback,
        use: [Helpers.laggy]
    });

    const handleSearchFormSubmit: React.ReactEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const searchTerm = e.currentTarget.searchTerm.value;
        const newQuery = { ...router.query, query: searchTerm };

        if (!searchTerm) {
            delete newQuery.query; // remove query param from browser url
        }

        await router.push({ query: newQuery }, undefined, { shallow: true });
        setOffset(0);
    };

    const pageTitle = Config.urls.searchAuthors.title;

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={Config.urls.searchAuthors.description} />
                <meta name="og:title" content={pageTitle} />
                <meta name="og:description" content={Config.urls.searchAuthors.description} />
                <meta name="keywords" content={Config.urls.searchAuthors.keywords.join(', ')} />
                <link rel="canonical" href={Config.urls.searchAuthors.canonical} />
            </Head>

            <Layouts.Standard>
                <Components.SearchPage
                    error={error || props.error}
                    handleSearchFormSubmit={handleSearchFormSubmit}
                    isValidating={isValidating}
                    limit={limit}
                    offset={offset}
                    query={query}
                    results={results?.data || []}
                    searchType="authors"
                    setLimit={setLimit}
                    setOffset={setOffset}
                    total={results?.metadata.total || 0}
                />
            </Layouts.Standard>
        </>
    );
};

export default Authors;
