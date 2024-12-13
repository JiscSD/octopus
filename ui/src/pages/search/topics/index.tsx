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
        fallbackData = (await api.get(topicsUrl)).data;
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

    const pageTitle = Config.urls.searchTopics.title;

    return (
        <>
            <Head>
                <title>{Config.urls.searchTopics.title}</title>
                <meta name="description" content={Config.urls.searchTopics.description} />
                <meta name="og:title" content={pageTitle} />
                <meta name="og:description" content={Config.urls.searchTopics.description} />
                <meta name="keywords" content={Config.urls.searchTopics.keywords.join(', ')} />
                <link rel="canonical" href={Config.urls.searchTopics.canonical} />
            </Head>

            <Layouts.Standard>
                <Components.SearchPage
                    error={error || props.error}
                    handleSearchFormSubmit={handleSearchFormSubmit}
                    isValidating={isValidating}
                    limit={limit}
                    offset={offset}
                    query={query}
                    results={data?.results || []}
                    searchType="topics"
                    setLimit={setLimit}
                    setOffset={setOffset}
                    total={data?.total || 0}
                />
            </Layouts.Standard>
        </>
    );
};

export default Topics;
