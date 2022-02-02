import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

import * as Components from '@components';
import * as Interfaces from '@interfaces';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Types from '@types';
import * as API from '@api';

const getResults = async (
    searchType: string | Types.SearchType,
    query: string | null = '',
    limit: number = 0,
    offset: number = 0,
    orderBy: Types.OrderBySearchOption = 'createdAt',
    orderDirection: Types.OrderDirectionSearchOption = 'asc'
) => {
    const endpoint = searchType === 'users' ? Config.endpoints.users : Config.endpoints.publications;
    const response = await API.get(
        `${endpoint}?search=${query}&limit=${limit}&offset=${offset}&orderBy=${orderBy}&orderDirection=${orderDirection}`
    );
    return response;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    let searchType: string | string[] | null = null;
    let query: string | string[] | null = null;
    let results: Interfaces.Publication[] | Interfaces.User[] | [] = [];
    let metadata: Interfaces.SearchResultMeta | {} = {};
    let error: boolean = false;
    let errorMessage: string = '';

    if (context.query.query) query = context.query.query;
    if (context.query.for) searchType = context.query.for;

    if (searchType) {
        if (Array.isArray(searchType)) searchType = searchType[0];
        if (Array.isArray(query)) query = query[0];

        if (searchType === 'publications' || searchType === 'users') {
            try {
                const response = await getResults(searchType, query);
                results = response.data.data;
                metadata = response.data.metadata;
            } catch (err) {
                error = true;
                errorMessage = 'There was a problem.';
            }
        }
    }

    return {
        props: {
            searchType,
            query,
            results,
            metadata,
            error,
            errorMessage
        }
    };
};

type Props = {
    searchType: Types.SearchType | null;
    query: string | null;
    results: Interfaces.Publication[] | Interfaces.User[] | [];
    metadata: Interfaces.SearchResultMeta | {};
    error: boolean;
    errorMessage: string;
};

const Search: NextPage<Props> = (props): JSX.Element => {
    const [searchType, setSearchType] = React.useState(props.searchType);
    const [query, setQuery] = React.useState(props.query);
    const [results, setResutls] = React.useState(props.results);
    const [metadta, setMetadata] = React.useState(props.metadata);
    const [error, setError] = React.useState(props.error);

    console.log(props);

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
                    <section className="container mx-auto grid grid-cols-1 px-8 pt-8 lg:grid-cols-3 lg:gap-4 lg:pt-36">
                        <h1>Search publication</h1>
                    </section>
                </Components.SectionTwo>
            </Layouts.Standard>
        </>
    );
};

export default Search;
