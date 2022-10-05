import React from 'react';
import Head from 'next/head';
import JWT from 'jsonwebtoken';
import { useRouter } from 'next/router';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Helpers from '@helpers';
import * as Config from '@config';
import * as Types from '@types';
import * as api from '@api';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    // If not logged in, i.e no token with the right key, send them to ocrid to login and return
    const decodedJWT = await Helpers.guardPrivateRoute(context);
    // If logged in, grab the token from cookies
    const token = Helpers.getJWT(context);

    let user: Interfaces.User | null = null;
    let error: string | null = null;

    // If there is a cookie with the correct key, send that token with the request, it will either pass or throw
    try {
        // @ts-ignore JWT.decode specifies a string return, but we know it will be an object with an id
        const response = await api.get(`${Config.endpoints.users}/${decodedJWT.id}/publications`, token);
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
            user,
            protectedPage: true
        }
    };
};

type Props = {
    user: Interfaces.User;
};

const Account: Types.NextPage<Props> = (props): React.ReactElement => {
    const router = useRouter();
    const livePublications = React.useMemo(
        () => props.user.Publication.filter((publication) => publication.currentStatus === 'LIVE'),
        [props.user.Publication]
    );

    const draftPublications = React.useMemo(
        () => props.user.Publication.filter((publication) => publication.currentStatus === 'DRAFT'),
        [props.user.Publication]
    );

    return (
        <>
            <Head>
                <meta name="robots" content="noindex, nofollow" />
                <meta name="description" content={Config.urls.account.description} />
                <meta name="keywords" content={Config.urls.account.keywords.join(',')} />
                <link rel="canonical" href={Config.urls.account.canonical} />
                <title>{`Author: ${props.user.orcid} - ${Config.urls.account.title}`}</title>
            </Head>
            <Layouts.Standard fixedHeader={false}>
                <header className="container mx-auto px-8 py-8 lg:pb-24 lg:pt-16">
                    <div className="mb-8 flex items-center">
                        <Components.Avatar user={props.user} className="text-xl lg:h-16 lg:w-16" />
                        <h1 className="ml-4 block font-montserrat text-2xl font-bold leading-tight text-grey-800 transition-colors duration-500 dark:text-white-50 md:text-3xl xl:text-3xl xl:leading-tight">
                            {props.user.firstName} {props.user.lastName}
                        </h1>
                    </div>
                    <div className="items-end lg:flex">
                        <h2 className="mb-2 mr-4 block border-teal-500 pr-4 font-montserrat text-lg font-medium leading-none text-grey-800 transition-colors duration-500 dark:text-white-50 lg:mb-0 lg:border-r">
                            ORCID:{' '}
                            <Components.Link href={`https://orcid.org/${props.user.orcid}`} openNew={true}>
                                <span className="font-semibold text-teal-500">{props.user.orcid}</span>
                            </Components.Link>
                        </h2>
                        {props.user.email && (
                            <h2 className="mb-2 mr-4 block border-teal-500 pr-4 font-montserrat text-lg font-medium leading-none text-grey-800 transition-colors duration-500 dark:text-white-50 lg:mb-0 lg:border-r">
                                Email: {props.user.email} (
                                <Components.Link
                                    href={`${Config.urls.verify.path}/?state=${encodeURIComponent(router.asPath)}`}
                                >
                                    <span className="font-semibold text-teal-500">Update</span>
                                </Components.Link>
                                )
                            </h2>
                        )}
                        <Components.Link
                            href={`${Config.urls.viewUser.path}/${props.user.id}`}
                            className="rounded underline decoration-teal-500 decoration-2 underline-offset-1 outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                            <h3 className="block font-montserrat text-sm font-medium leading-none text-grey-800 transition-colors duration-500 dark:text-white-50">
                                View live author page
                            </h3>
                        </Components.Link>
                    </div>
                </header>

                <section id="content" className="container mx-auto mb-16 px-8">
                    <h2 className="mb-4 font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-50 lg:mb-8">
                        Draft publications
                    </h2>
                    {draftPublications.length ? (
                        <div className="rouned-md relative space-y-4 lg:w-2/3">
                            {draftPublications.map((publication: Interfaces.Publication) => (
                                <Components.Link
                                    key={publication.id}
                                    href={`${Config.urls.viewPublication.path}/${publication.id}/edit`}
                                    className="mb-5 flex "
                                >
                                    <Components.PublicationSimpleResult publication={publication} />
                                </Components.Link>
                            ))}
                        </div>
                    ) : (
                        <Components.Alert
                            severity="INFO"
                            title="You do not currently have any draft publications"
                            className="w-fit"
                        />
                    )}
                </section>

                <section className="container mx-auto mb-16 px-8">
                    <h2 className="mb-4 font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-50 lg:mb-8">
                        Live publications
                    </h2>
                    {livePublications.length ? (
                        <div className="rouned-md relative lg:w-2/3">
                            {livePublications.map((publication: Interfaces.Publication) => (
                                <Components.Link
                                    key={publication.id}
                                    href={`${Config.urls.viewPublication.path}/${publication.id}`}
                                    className="mb-5 flex "
                                >
                                    <Components.PublicationSimpleResult publication={publication} />
                                </Components.Link>
                            ))}
                        </div>
                    ) : (
                        <Components.Alert
                            severity="INFO"
                            title="You do not currently have any live publications"
                            className="w-fit"
                        />
                    )}
                </section>
            </Layouts.Standard>
        </>
    );
};

export default Account;
