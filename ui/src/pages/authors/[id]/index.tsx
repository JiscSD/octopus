import React from 'react';
import Head from 'next/head';
import * as Framer from 'framer-motion';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Types from '@types';
import * as api from '@api';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const requestId = context.query.id;
    let user: Interfaces.User | null = null;
    let error: string | null = null;

    try {
        const response = await api.get(`${Config.endpoints.users}/${requestId}`, undefined);
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

    return {
        props: {
            user
        }
    };
};

type Props = {
    user: Interfaces.User;
};

const Author: Types.NextPage<Props> = (props): React.ReactElement => {
    const [publicationLimit, setPublicationLimit] = React.useState(1);

    return (
        <>
            <Head>
                <meta name="description" content="" />
                <meta name="keywords" content="" />
                <link rel="canonical" href={`${Config.urls.viewUser.canonical}/${props.user.id}`} />
                <title>{`Author: ${props.user.orcid} - ${Config.urls.viewUser.title}`}</title>
            </Head>
            <Layouts.Standard fixedHeader={false}>
                <header className="container mx-auto px-8 py-8 lg:pb-24 lg:pt-16">
                    <div className="mb-8 flex items-center">
                        <Components.Avatar user={props.user} className="text-xl lg:h-16 lg:w-16" />
                        <h1 className="ml-4 block font-montserrat text-2xl font-bold leading-tight text-grey-800 transition-colors duration-500 dark:text-white-50 md:text-3xl xl:text-3xl xl:leading-tight">
                            {props.user.firstName} {props.user.lastName}
                        </h1>
                    </div>
                    <h3 className="block font-montserrat text-lg font-medium text-grey-800 transition-colors duration-500 dark:text-white-50">
                        ORCID:{' '}
                        <Components.Link href={`https://orcid.org/${props.user.orcid}`} openNew={true}>
                            <span className="font-semibold text-teal-500">{props.user.orcid}</span>
                        </Components.Link>
                    </h3>
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
                    {props.user.Publication.length ? (
                        <div className="rouned-md relative lg:w-2/3">
                            {props.user.Publication.map((publication: Interfaces.Publication, index) => {
                                if (index <= publicationLimit) {
                                    let classes = '';
                                    index === 0 ? (classes += 'rounded-t-lg ') : null;
                                    publicationLimit !== 1 && index === publicationLimit - 1
                                        ? (classes += 'rounded-b-lg')
                                        : null;

                                    return (
                                        <Components.Delay key={publication.id} delay={index * 50}>
                                            <Components.PublicationSearchResult
                                                publication={publication}
                                                className={classes}
                                            />
                                        </Components.Delay>
                                    );
                                }
                            })}

                            {publicationLimit !== props.user.Publication.length && (
                                <Framer.motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute -bottom-10 z-40 flex h-72 w-full items-end justify-center from-transparent to-teal-50 transition-colors duration-500 dark:to-grey-800 lg:bottom-0 lg:bg-gradient-to-b"
                                >
                                    <button
                                        onClick={(e) => setPublicationLimit(props.user.Publication.length)}
                                        className="rounded py-1 px-2 text-sm font-semibold uppercase tracking-widest text-grey-600 outline-0 focus:ring-2 focus:ring-yellow-400 dark:text-grey-100"
                                    >
                                        Show all
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
