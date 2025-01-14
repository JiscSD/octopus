import React, { useMemo, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import useSWR from 'swr';
import * as Router from 'next/router';
import * as SolidIcons from '@heroicons/react/24/solid';

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
    let publications: Interfaces.SearchResults<Interfaces.Publication> | null = null;
    let flags: Interfaces.FlagByUser[] | null = null;
    let getUserError: string | null = null;

    [user, publications, flags] = await Promise.all([
        api
            .get(`${Config.endpoints.users}/${userId}`, token)
            .then((res) => res.data)
            .catch((error) => {
                const { message } = error as Interfaces.JSONResponseError;
                getUserError = message;
                console.log(error);
            }),
        api
            .get(userPublicationsUrl)
            .then((res) => res.data)
            .catch((error) => {
                console.log(error);
                return null;
            }),
        api
            .get(`${Config.endpoints.users}/${userId}/flags`)
            .then((res) => res.data)
            .catch((error) => {
                console.log(error);
                return null;
            })
    ]);

    if (!user || getUserError) {
        return {
            notFound: true
        };
    }

    return {
        props: {
            query,
            user,
            publications,
            flags
        }
    };
};

type Props = {
    query: string | null;
    user: Interfaces.User;
    publications: Interfaces.SearchResults<Interfaces.Publication> | null;
    flags: Interfaces.SearchResults<Interfaces.FlagByUser> | null;
};

const Author: Types.NextPage<Props> = (props): React.ReactElement => {
    const router = Router.useRouter();
    const [publicationsQuery, setPublicationsQuery] = useState(props.query ? props.query : '');
    const [publicationsLimit, setPublicationsLimit] = useState(20);
    const [publicationsOffset, setPublicationsOffset] = useState(0);
    const [flagsOffset, setFlagsOffset] = useState(0);
    const [includeResolvedFlags, setIncludeResolvedFlags] = useState(false);

    const publicationsSwrKey = `${Config.endpoints.users}/${props.user.id}/publications?offset=${publicationsOffset}&limit=${publicationsLimit}&query=${publicationsQuery}`;
    const {
        data: getPublicationsResponse,
        error: getPublicationsError,
        isValidating: getPublicationsIsValidating
    } = useSWR<Interfaces.SearchResults<Interfaces.Publication>>(publicationsSwrKey, null, {
        fallbackData: props.publications || undefined
    });
    const getPublicationsErrorMessage = axios.isAxiosError(getPublicationsError)
        ? getPublicationsError.message
        : undefined;

    const flagsSwrKey = `${Config.endpoints.users}/${props.user.id}/flags?offset=${flagsOffset}&includeResolved=${includeResolvedFlags}`;
    const { data: getFlagsResponse, isValidating: getFlagsIsValidating } = useSWR<
        Interfaces.SearchResults<Interfaces.FlagByUser>
    >(flagsSwrKey, null, {
        fallbackData: props.flags || undefined
    });

    const searchInputRef = React.useRef<HTMLInputElement>(null);
    const missingNames = !props.user.firstName && !props.user.lastName;
    const isOrganisationalAccount = props.user.role === 'ORGANISATION';
    const pageTitle = `Author: ${isOrganisationalAccount ? props.user.firstName : props.user.orcid} - ${Config.urls.viewUser.title}`;

    // The search interface component expects a publication version.
    // The endpoint is expected to return a publication with 1 version (the latest live one).
    // So make an array of latest live publication versions from the response.
    const publicationVersions: Interfaces.PublicationVersion[] = useMemo(
        () =>
            getPublicationsResponse?.data
                ?.filter((publication) => publication.versions[0].isLatestLiveVersion)
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
                }) || [],
        [getPublicationsResponse, props.user]
    );

    const handlePublicationsSearchFormSubmit: React.ReactEventHandler<HTMLFormElement> = async (
        e: React.SyntheticEvent<HTMLFormElement, Event>
    ): Promise<void> => {
        e.preventDefault();
        const searchTerm = e.currentTarget.searchTerm.value;
        const newQuery = { ...router.query, query: searchTerm };

        if (!searchTerm) {
            delete newQuery.query; // remove query param from browser url
        }

        await router.push({ query: newQuery }, undefined, { shallow: true });
        setPublicationsOffset(0);
        setPublicationsQuery(searchTerm);
    };

    const flags = getFlagsResponse?.data || [];
    const flagResults = getFlagsResponse ? (
        <div className="rounded">
            {flags.map((flag, index: number) => {
                let classes = '';

                if (index === 0) {
                    classes += 'rounded-t';
                }

                if (index === flags.length - 1) {
                    classes += ' !border-b-transparent !rounded-b';
                }

                const publication = flag.publication;
                const { coAuthors, content, description, publishedDate, title } = publication.versions[0];

                return (
                    <Components.PublicationSearchResult
                        key={publication.id}
                        className={classes}
                        coAuthors={coAuthors}
                        content={content}
                        description={description}
                        linkDestination={`${Config.urls.viewPublication.path}/${publication.id}/flag/${flag.id}`}
                        preface={
                            <div className="flex gap-4 leading-none">
                                <SolidIcons.FlagIcon className="h-4 w-4 text-red-500" />
                                <span>
                                    Raised on <time suppressHydrationWarning>{Helpers.formatDate(flag.createdAt)}</time>{' '}
                                    for{' '}
                                    {Config.values.octopusInformation.redFlagReasons[
                                        flag.category
                                    ].nicename.toLowerCase()}{' '}
                                    against the following publication:
                                </span>
                            </div>
                        }
                        publicationId={publication.id}
                        publishedDate={publishedDate}
                        title={title}
                        type={publication.type}
                    />
                );
            })}
        </div>
    ) : null;

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

                <section className="container mx-auto pb-12 lg:pb-24 px-8">
                    <h2 className="mb-4 font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-50 lg:mb-8">
                        Octopus publications
                    </h2>
                    <Components.SearchInterface
                        error={getPublicationsErrorMessage}
                        handleSearchFormSubmit={handlePublicationsSearchFormSubmit}
                        isValidating={getPublicationsIsValidating}
                        limit={publicationsLimit}
                        noResultsMessage="This user does not currently have any live publications"
                        offset={publicationsOffset}
                        pageSizes={[10, 20, 50]}
                        query={publicationsQuery}
                        ref={searchInputRef}
                        results={publicationVersions}
                        searchType="publication-versions"
                        setLimit={setPublicationsLimit}
                        setOffset={setPublicationsOffset}
                        total={getPublicationsResponse?.metadata.total || 0}
                    ></Components.SearchInterface>
                </section>

                {getFlagsResponse && flags.length ? (
                    <section className="container mx-auto px-8">
                        <h2 className="mb-4 font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-50 lg:mb-8">
                            Red flags raised by this user
                        </h2>
                        <Components.Checkbox
                            checked={includeResolvedFlags}
                            className="mb-4 lg:mb-8"
                            id="include-resolved-flags"
                            label="Include resolved flags"
                            name="include-resolved-flags"
                            onChange={(e) => setIncludeResolvedFlags(e.target.checked)}
                        />
                        <Components.PaginatedResults
                            isValidating={getFlagsIsValidating}
                            limit={10}
                            offset={flagsOffset}
                            results={flagResults}
                            setOffset={setFlagsOffset}
                            total={getFlagsResponse.metadata.total}
                        />
                    </section>
                ) : null}
            </Layouts.Standard>
        </>
    );
};

export default Author;
