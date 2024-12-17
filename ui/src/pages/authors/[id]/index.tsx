import React, { useMemo, useState } from 'react';
import Head from 'next/head';
import useSWR from 'swr';
import * as Router from 'next/router';

import * as api from '@/api';
import * as Assets from '@/assets';
import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as Interfaces from '@/interfaces';
import * as Layouts from '@/layouts';
import * as Types from '@/types';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const userId = context.query.id;
    const limit = Helpers.extractNextQueryParam(context.query.limit, true);
    const offset = Helpers.extractNextQueryParam(context.query.offset, true);
    const query = Helpers.extractNextQueryParam(context.query.query);
    const userPublicationsUrl = `${Config.endpoints.users}/${userId}/publications?offset=${offset || 0}&limit=${limit || 20}&query=${query || ''}`;
    const token = Helpers.getJWT(context);
    let user: Interfaces.User | null = null;
    let publications: Interfaces.SearchResults<Interfaces.Publication> | undefined = undefined;
    let error: string | null = null;

    try {
        const response = await api.get(`${Config.endpoints.users}/${userId}`, token);
        user = response.data;
    } catch (err) {
        const { message } = err as Interfaces.JSONResponseError;
        error = message;
    }

    if (!user || error) {
        return {
            notFound: true
        };
    }

    try {
        const response = await api.get(userPublicationsUrl);
        publications = response.data;
    } catch (error) {
        console.log(error);
    }

    return {
        props: {
            query,
            user,
            userPublicationsUrl,
            fallbackData: publications
        }
    };
};

type Props = {
    query: string | null;
    user: Interfaces.User;
    userPublicationsUrl: string;
    fallbackData: Interfaces.SearchResults<Interfaces.Publication> | undefined;
};

const Author: Types.NextPage<Props> = (props): React.ReactElement => {
    const router = Router.useRouter();
    const [query, setQuery] = useState(props.query ? props.query : '');
    const [limit, setLimit] = useState(20);
    const [offset, setOffset] = useState(0);
    const swrKey = `${Config.endpoints.users}/${props.user.id}/publications?offset=${offset}&limit=${limit}&query=${query}`;
    const {
        data: response,
        error,
        isValidating
    } = useSWR<Interfaces.SearchResults<Interfaces.Publication>>(swrKey, null, {
        fallbackData: props.fallbackData
    });
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    const missingNames = !props.user.firstName && !props.user.lastName;
    const isOrganisationalAccount = props.user.role === 'ORGANISATION';
    const pageTitle = `Author: ${isOrganisationalAccount ? props.user.firstName : props.user.orcid} - ${Config.urls.viewUser.title}`;

    // The result component expects a publication version.
    // The endpoint is expected to return a publication with 1 version (the latest live one).
    // So make an array of latest live publication versions from the response.
    const publicationVersions: Interfaces.PublicationVersion[] = useMemo(
        () =>
            response?.data
                ? response.data
                      // Explicitly specify our expectation about the first version being latest live for typescript.
                      .filter((publication) => publication.versions[0].isLatestLiveVersion)
                      .map((publication) => {
                          const version = publication.versions[0];
                          version.user = {
                              id: props.user.id,
                              createdAt: props.user.createdAt,
                              email: props.user.email || '',
                              firstName: props.user.firstName,
                              lastName: props.user.lastName,
                              orcid: props.user.orcid,
                              updatedAt: props.user.updatedAt,
                              role: props.user.role
                          };

                          version.publication = {
                              id: publication.id,
                              type: publication.type,
                              doi: publication.doi,
                              url_slug: publication.url_slug,
                              flagCount: publication.flagCount,
                              peerReviewCount: publication.peerReviewCount
                          };
                          return version;
                      })
                : [],
        [response, props.user]
    );

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

    return (
        <>
            <Head>
                <title>{pageTitle}</title>
                <meta name="og:title" content={pageTitle} />
                <link rel="canonical" href={`${Config.urls.viewUser.canonical}/${props.user.id}`} />
            </Head>
            <Layouts.Standard fixedHeader={false}>
                <header className="container mx-auto px-8 py-8 lg:pb-24 lg:pt-16">
                    <div className="mb-8 flex items-center">
                        <Components.Avatar user={props.user} className="text-xl lg:h-16 lg:w-16" />
                        <h1 className="ml-4 block font-montserrat text-2xl font-bold leading-tight text-grey-800 transition-colors duration-500 dark:text-white-50 md:text-3xl xl:text-3xl xl:leading-tight">
                            {missingNames
                                ? 'Anonymous User'
                                : `${props.user.firstName}${props.user.lastName ? ' ' + props.user.lastName : ''}`}
                        </h1>
                    </div>
                    {!isOrganisationalAccount && props.user.id !== 'octopus' && (
                        <div className="font-montserrat text-lg font-medium text-grey-800 transition-colors duration-500 dark:text-white-50">
                            <Components.Link
                                title="ORCID profile"
                                className="flex w-fit items-center gap-2"
                                href={`https://orcid.org/${props.user.orcid}`}
                                openNew={true}
                            >
                                <Assets.OrcidLogoIcon width={24} />
                                <span className="font-semibold text-teal-500">{props.user.orcid}</span>
                            </Components.Link>
                        </div>
                    )}
                </header>

                {!isOrganisationalAccount && (
                    <>
                        <section className="container mx-auto px-8 pb-12 lg:pb-24">
                            <h2 className="mb-4 font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-50 lg:mb-8">
                                Employment
                            </h2>
                            <div className="2xl:w-2/3">
                                {props.user.employment.length ? (
                                    <Components.UserHistoryTable
                                        heads={['Organisation', 'Role', 'Department', 'Start date', 'End date']}
                                        records={props.user.employment}
                                    />
                                ) : (
                                    <p className="text-grey-800 transition-colors duration-500 dark:text-white-50">
                                        No history available.
                                    </p>
                                )}
                            </div>
                        </section>

                        <section className="container mx-auto px-8 pb-12 lg:pb-24">
                            <h2 className="mb-4 font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-50 lg:mb-8">
                                Education
                            </h2>
                            <div className="2xl:w-2/3">
                                {props.user.education.length ? (
                                    <Components.UserHistoryTable
                                        heads={['Organisation', 'Degree/title', 'Department', 'Start date', 'End date']}
                                        records={props.user.education}
                                    />
                                ) : (
                                    <p className="text-grey-800 transition-colors duration-500 dark:text-white-50">
                                        No history available.
                                    </p>
                                )}
                            </div>
                        </section>

                        <section className="container mx-auto px-8 pb-12 lg:pb-24">
                            <h2 className="mb-4 font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-50 lg:mb-8">
                                Works
                            </h2>
                            <div className="2xl:w-2/3">
                                {props.user.works.length ? (
                                    <Components.UserWorksTable
                                        heads={['Title', 'DOI', 'Published date']}
                                        records={props.user.works}
                                    />
                                ) : (
                                    <p className="text-grey-800 transition-colors duration-500 dark:text-white-50">
                                        No works available.
                                    </p>
                                )}
                            </div>
                        </section>
                    </>
                )}

                <section className="container mx-auto mb-16 px-8">
                    <h2 className="mb-4 font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-50 lg:mb-8">
                        Octopus publications
                    </h2>
                    <Components.SearchInterface
                        error={error}
                        handleSearchFormSubmit={handleSearchFormSubmit}
                        isValidating={isValidating}
                        limit={limit}
                        noResultsMessage="This user does not currently have any live publications"
                        offset={offset}
                        pageSizes={[10, 20, 50]}
                        query={query}
                        ref={searchInputRef}
                        results={publicationVersions}
                        searchType="publication-versions"
                        setLimit={setLimit}
                        setOffset={setOffset}
                        total={response?.metadata.total || 0}
                    ></Components.SearchInterface>
                </section>
            </Layouts.Standard>
        </>
    );
};

export default Author;
