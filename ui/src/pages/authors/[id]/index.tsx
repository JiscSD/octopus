import React, { useMemo, useState } from 'react';
import Head from 'next/head';
import useSWRInfinite from 'swr/infinite';

import * as Framer from 'framer-motion';
import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Types from '@types';
import * as Assets from '@assets';
import * as Helpers from '@helpers';
import * as api from '@api';

const pageSize = 10;

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const userId = context.query.id;
    const userPublicationVersionsUrl = `${Config.endpoints.users}/${userId}/publication-versions?offset=0&limit=${pageSize}`;
    const token = Helpers.getJWT(context);
    let user: Interfaces.User | null = null;
    let firstUserPublicationsPage: Interfaces.UserPublicationVersionsResult | null = null;
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
        const response = await api.get(userPublicationVersionsUrl, undefined);
        firstUserPublicationsPage = response.data;
    } catch (error) {
        console.log(error);
    }

    return {
        props: {
            user,
            userPublicationVersionsUrl,
            fallbackData: firstUserPublicationsPage,
            metadata: {
                title: `Author: ${user.orcid} - ${Config.urls.viewUser.title}`
            }
        }
    };
};

type Props = {
    user: Interfaces.User;
    userPublicationVersionsUrl: string;
    fallbackData: Interfaces.UserPublicationVersionsResult | null;
    metadata: {
        title: string;
    };
};

const Author: Types.NextPage<Props> = (props): React.ReactElement => {
    const [hideShowMoreButton, setHideShowMoreButton] = useState(false);

    const { data, setSize } = useSWRInfinite<Interfaces.UserPublicationVersionsResult>(
        (pageIndex, prevPageData) => {
            if (pageIndex === 0) {
                return props.userPublicationVersionsUrl;
            }

            if (prevPageData && !prevPageData.results.length) {
                return null; // reached the end
            }

            return props.userPublicationVersionsUrl.replace('offset=0', `offset=${pageIndex * pageSize}`);
        },
        async (url) => {
            const response = await api.get(url, undefined);
            const data = response.data;
            const { offset, limit, total } = data;

            if (offset + limit >= total) {
                setHideShowMoreButton(true);
            }

            return data;
        },
        {
            fallbackData: props.fallbackData ? [props.fallbackData] : undefined
        }
    );

    const userPublicationVersions = useMemo(() => data?.map((data) => data.results).flat() || [], [data]);

    return (
        <>
            <Head>
                <meta name="description" content="" />
                <meta name="keywords" content="" />
                <link rel="canonical" href={`${Config.urls.viewUser.canonical}/${props.user.id}`} />
                <title>{props.metadata.title}</title>
            </Head>
            <Layouts.Standard fixedHeader={false}>
                <header className="container mx-auto px-8 py-8 lg:pb-24 lg:pt-16">
                    <div className="mb-8 flex items-center">
                        <Components.Avatar user={props.user} className="text-xl lg:h-16 lg:w-16" />
                        <h1 className="ml-4 block font-montserrat text-2xl font-bold leading-tight text-grey-800 transition-colors duration-500 dark:text-white-50 md:text-3xl xl:text-3xl xl:leading-tight">
                            {props.user.firstName} {props.user.lastName}
                        </h1>
                    </div>
                    <div className="font-montserrat text-lg font-medium text-grey-800 transition-colors duration-500 dark:text-white-50">
                        {props.user.id === 'octopus' ? null : (
                            <Components.Link
                                title="ORCID profile"
                                className="flex w-fit items-center gap-2"
                                href={`https://orcid.org/${props.user.orcid}`}
                                openNew={true}
                            >
                                <Assets.OrcidLogoIcon width={24} />
                                <span className="font-semibold text-teal-500">{props.user.orcid}</span>
                            </Components.Link>
                        )}
                    </div>
                </header>

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

                <section className="container mx-auto mb-16 px-8">
                    <h2 className="mb-4 font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-50 lg:mb-8">
                        Octopus publications
                    </h2>
                    {userPublicationVersions.length ? (
                        <div className="rouned-md relative lg:w-2/3">
                            {userPublicationVersions.map((publicationVersion, index) => {
                                if (index <= userPublicationVersions.length) {
                                    let classes = '';

                                    if (index === 0) {
                                        classes += 'rounded-t-lg ';
                                    }

                                    if (index === userPublicationVersions.length - 1) {
                                        classes += 'rounded-b-lg';
                                    }

                                    publicationVersion.user = {
                                        id: props.user.id,
                                        createdAt: props.user.createdAt,
                                        email: props.user.email || '',
                                        firstName: props.user.firstName,
                                        lastName: props.user.lastName,
                                        orcid: props.user.orcid,
                                        updatedAt: props.user.updatedAt
                                    };

                                    return (
                                        <Components.Delay key={publicationVersion.id} delay={50}>
                                            <Components.PublicationSearchResult
                                                publicationVersion={publicationVersion}
                                                className={classes}
                                            />
                                        </Components.Delay>
                                    );
                                }
                            })}

                            {!hideShowMoreButton && (
                                <Framer.motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute -bottom-10 z-10 flex h-72 w-full items-end justify-center from-transparent to-teal-50 transition-colors duration-500 dark:to-grey-800 lg:bottom-0 lg:bg-gradient-to-b"
                                >
                                    <button
                                        onClick={(e) => setSize((prevSize) => prevSize + 1)}
                                        className="rounded px-2 py-1 text-sm font-semibold uppercase tracking-widest text-grey-600 outline-0 focus:ring-2 focus:ring-yellow-400 dark:text-grey-100"
                                    >
                                        Show More
                                    </button>
                                </Framer.motion.div>
                            )}
                        </div>
                    ) : (
                        <Components.Alert
                            severity="INFO"
                            title="This user does not currently have any live publications"
                            className="w-fit"
                        />
                    )}
                </section>
            </Layouts.Standard>
        </>
    );
};

export default Author;
