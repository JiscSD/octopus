import React from 'react';
import Head from 'next/head';
import * as Router from 'next/router';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Layouts from '@layouts';
import * as Stores from '@stores';
import * as Config from '@config';
import * as Types from '@types';
import * as API from '@api';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const requestId = context.query.id;
    let user: Interfaces.User | null = null;
    let error: string | null = null;

    try {
        const response = await API.get(`${Config.endpoints.users}/${requestId}`);
        user = response.data;
    } catch (err) {
        const { message } = err as Interfaces.JSONResponseError;
        error = message;
        console.log(message);
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

const Author: Types.NextPage<Props> = (props): JSX.Element => {
    const router = Router.useRouter();
    const showCmdPalette = Stores.useGlobalsStore((state: Types.GlobalsStoreType) => state.showCmdPalette);
    const toggleCmdPalette = Stores.useGlobalsStore((state: Types.GlobalsStoreType) => state.toggleCmdPalette);

    React.useEffect(() => showCmdPalette && toggleCmdPalette(), []);

    return (
        <>
            <Head>
                <meta name="description" content="" />
                <meta name="keywords" content="" />
                <link rel="canonical" href={`${Config.urls.viewUser.canonical}/${props.user.id}`} />
                <title>{`Author: ${props.user.orcid} - ${Config.urls.viewUser.title}`}</title>
            </Head>
            <Layouts.Standard fixedHeader={false}>
                <Components.SectionTwo
                    className="bg-teal-50 dark:bg-grey-800"
                    waveFillTop="fill-teal-100 dark:fill-grey-500 transition-colors duration-500"
                    waveFillMiddle="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                    waveFillBottom="fill-teal-700 dark:fill-grey-800 transition-colors duration-500"
                >
                    <header className="container mx-auto px-8 py-8 lg:pb-24 lg:pt-16">
                        <h1 className="mb-8 block font-montserrat text-2xl font-bold leading-tight text-grey-800 transition-colors duration-500 dark:text-white md:text-3xl xl:text-3xl xl:leading-tight">
                            {props.user.firstName}. {props.user.lastName}
                        </h1>
                        <h3 className="block font-montserrat text-lg font-medium text-grey-800 transition-colors duration-500 dark:text-white">
                            ORCID: <span className="font-semibold text-teal-500">{props.user.orcid}</span>
                        </h3>
                    </header>

                    <section id="content" className="container mx-auto px-8 pb-12 lg:pb-24">
                        <h2 className="mb-4 font-montserrat text-xl font-semibold text-grey-800 dark:text-white lg:mb-8">
                            Research breakdown
                        </h2>
                        <Components.UserBreakdown user={props.user} />
                    </section>

                    <section className="container mx-auto px-8">
                        <h2 className="mb-4 font-montserrat text-xl font-semibold text-grey-800 dark:text-white lg:mb-8">
                            Octopus publications
                        </h2>
                        {props.user.Publication.length ? (
                            props.user.Publication.map((publication: Interfaces.Publication, index: number) => {
                                let classes = '';
                                index === 0 ? (classes += 'rounded-t-lg ') : null;
                                index === props.user.Publication.length - 1 ? (classes += 'rounded-b-lg') : null;
                                <Components.Delay delay={index * 50}>
                                    <Components.PublicationSearchResult
                                        key={publication.id}
                                        id={publication.id}
                                        title={publication.title}
                                        createdBy={`${publication?.user?.firstName}. ${publication?.user?.lastName}`}
                                        type={publication.type}
                                        date={publication.updatedAt}
                                        className={classes}
                                    />
                                </Components.Delay>;
                            })
                        ) : (
                            <Components.Alert
                                severity="INFO"
                                title="This user does not currently have any live publications"
                                className="w-fit"
                            />
                        )}
                    </section>
                </Components.SectionTwo>
            </Layouts.Standard>
        </>
    );
};

export default Author;
