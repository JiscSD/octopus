import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

import * as Components from '@components';
import * as Interfaces from '@interfaces';
import * as Layouts from '@layouts';
import * as Config from '@config';
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
    searchType: Types.SearchType | null;
    query: string | null;
    publicationType: string | null;
    results: Interfaces.Publication[] | Interfaces.User[] | [];
    metadata: Interfaces.SearchResultMeta | {};
    error: string | null;
};

const Search: NextPage<Props> = (props): JSX.Element => {
    const [loading, setLoading] = React.useState(false);
    const [searchType, setSearchType] = React.useState(props.searchType);
    const [query, setQuery] = React.useState(props.query);
    const [publicationType, setPublicationType] = React.useState(props.publicationType);
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
                    <section className="container mx-auto px-8 py-8 lg:gap-4 lg:pt-36">
                        <Components.PageTitle text="Search results" />
                    </section>
                    <section id="content" className="container mx-auto grid grid-cols-1 px-8 lg:grid-cols-8 lg:gap-16">
                        {!loading && !error && <p>Results to show</p>}
                        {loading && !error && <p>loading state</p>}
                        {!loading && error && (
                            <div className="col-span-8">
                                <Components.Alert
                                    severity="ERROR"
                                    title="There was a problem fetching results"
                                    details={[error]}
                                />
                            </div>
                        )}
                    </section>
                </Components.SectionTwo>
            </Layouts.Standard>
        </>
    );
};

export default Search;
