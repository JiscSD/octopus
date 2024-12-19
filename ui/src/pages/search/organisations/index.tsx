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

const baseEndpoint = '/users?role=ORGANISATION';

/**
 *
 * @TODO - refactor getServerSideProps
 * remove unnecessary if statements
 */

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    let error: string | null = null;
    const limit = Helpers.extractNextQueryParam(context.query.limit, true);
    const offset = Helpers.extractNextQueryParam(context.query.offset, true);
    const query = Helpers.extractNextQueryParam(context.query.query);

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
        fallbackData = (await api.get(swrKey, undefined)).data;
    } catch (err) {
        const { message } = err as Interfaces.JSONResponseError;
        error = message;
    }

    return {
        props: {
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

    const pageTitle = Config.urls.searchOrganisations.title;

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={Config.urls.searchOrganisations.description} />
                <meta name="og:title" content={pageTitle} />
                <meta name="og:description" content={Config.urls.searchOrganisations.description} />
                <meta name="keywords" content={Config.urls.searchOrganisations.keywords.join(', ')} />
                <link rel="canonical" href={Config.urls.searchOrganisations.canonical} />
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
                    searchType={'organisations'}
                    setLimit={setLimit}
                    setOffset={setOffset}
                    showSearchTypeSwitch={true}
                    total={results?.metadata.total || 0}
                />
            </Layouts.Standard>
        </>
    );
};

export default Authors;
