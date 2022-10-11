import React, { useEffect, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import * as Helpers from '@helpers';
import * as Assets from '@assets';
import * as Stores from '@stores';
import * as Config from '@config';
import * as Types from '@types';
import * as api from '@api';
import * as Components from '@components';
import * as Hooks from '@hooks';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const homeUrl = encodeURIComponent(Config.urls.home.path);
    const { code = null, state: redirectTo = homeUrl, error = null } = context.query;
    let token: string | null = null;

    if (error) {
        return {
            props: {
                token,
                redirectTo,
                error
            }
        };
    }

    if (!code) {
        // prevent users to access /login directly without a code
        return {
            redirect: {
                destination: Config.urls.home.path,
                permanent: false
            },
            props: {}
        };
    }

    try {
        const response = await api.post(
            `${Config.endpoints.authorization}`,
            {
                code
            },
            undefined
        );
        token = response.data as string;
    } catch (err) {
        console.log(error);
        return {
            props: {
                token,
                redirectTo,
                error: 'invalid_token'
            }
        };
    }

    return {
        props: { token, redirectTo }
    };
};

type Props = {
    token: string | null;
    redirectTo: string;
    error?: string;
};

const Login: Types.NextPage<Props> = (props): React.ReactElement => {
    const router = useRouter();
    const { setUser } = Stores.useAuthStore();
    const { darkMode } = Stores.usePreferencesStore();
    const xs = Hooks.useMediaQuery('(max-width: 640px)');

    useEffect(() => {
        if (props.token) {
            const decodedJWT = Helpers.setAndReturnJWT(props.token) as Types.UserType;
            if (decodedJWT) {
                setUser(Object.assign(decodedJWT, { token: props.token }));
            }
            setTimeout(() => router.push(decodeURIComponent(props.redirectTo)), 1000);
        }
    }, [props.redirectTo, props.token, router, setUser]);

    const loginError = useMemo(() => {
        if (!props.error) {
            return null;
        }

        switch (props.error) {
            case 'access_denied': {
                return (
                    <>
                        <h2 className="mb-4 font-montserrat text-xl font-semibold text-teal-900 transition-colors duration-500 dark:text-white-50">
                            Could not create Octopus account
                        </h2>
                        <p className="max-w-2xl pb-10 text-grey-800 dark:text-white-50">
                            ORCID® connection unsuccessful.
                            <br />
                            <br />
                            You declined access to your ORCID account. A connection to ORCID is required to create an
                            Octopus profile and publish content to the site.
                            <br />
                            <br />
                            Please try again if this wasn&apos;t intended.
                            <br />
                            <br />
                            You can still read published content without registering to Octopus.{' '}
                            <Components.Link href={Config.urls.browsePublications.path} className="underline">
                                Browse the latest publications
                            </Components.Link>
                            .
                        </p>

                        <h2 className="mb-4 font-inter text-xl font-semibold text-teal-900 transition-colors duration-500 dark:text-white-50">
                            Why ORCID?
                        </h2>
                        <p className="mb-8 max-w-2xl text-grey-800 dark:text-white-50">
                            ORCID, which stands for Open Researcher and Contributor ID, is a free, unique, persistent
                            identifier (PID) for individuals to use as they engage in research, scholarship, and
                            innovation activities.
                            <br />
                            <br />
                            This ORCID iD distinguishes you from other researchers, even if you change name or
                            organisation, and provides a single record of your research outputs and activities. ORCID is
                            integrated into many systems used by publishers, funders, institutions, and other
                            research-related services. Connecting your ORCID record with trusted organisations makes it
                            easier to share your profile and research data, allowing you to spend more time conducting
                            your research and less time managing it.
                            <br />
                            <br />
                            Learn more at{' '}
                            <Components.Link href="https://orcid.org" openNew className="underline">
                                ORCID.org
                            </Components.Link>
                            .
                        </p>
                        <Components.Link
                            href={`${Config.urls.orcidLogin.path}&state=${props.redirectTo}`}
                            ariaLabel="Sign in with ORCID"
                            className="flex items-center rounded-md bg-orcid py-2 px-4"
                        >
                            <Assets.ORCID width={20} height={20} className="fill-white-50" />
                            <span className="ml-2 text-xs text-white-50">Sign in with ORCID</span>
                        </Components.Link>
                    </>
                );
            }

            default: {
                return (
                    <>
                        <h2 className="mb-4 font-montserrat text-xl font-semibold text-teal-900 transition-colors duration-500 dark:text-white-50">
                            Something went wrong.
                            {xs ? <br /> : ' '}
                            Please try again!
                        </h2>
                        <Components.Link
                            href={`${Config.urls.orcidLogin.path}&state=${props.redirectTo}`}
                            ariaLabel="Sign in with ORCID"
                            className="flex items-center rounded-md bg-orcid py-2 px-4"
                        >
                            <Assets.ORCID width={20} height={20} className="fill-white-50" />
                            <span className="ml-2 text-xs text-white-50">Sign in with ORCID</span>
                        </Components.Link>
                    </>
                );
            }
        }
    }, [props.error, props.redirectTo, xs]);

    return (
        <>
            <Head>
                <meta name="robots" content="noindex" />
                <title>{Config.urls.orcidLoginCallback.title}</title>
            </Head>

            <main className="container flex min-h-screen w-full flex-col items-center justify-center bg-white-50 py-20 px-8 text-center dark:bg-grey-800">
                {loginError || (
                    <>
                        {darkMode ? (
                            <Assets.LogoDark height={100} width={100} className="animate-bounce" />
                        ) : (
                            <Assets.LogoLight height={100} width={100} className="animate-bounce" />
                        )}
                        <h1 className="font-montserrat text-xl font-semibold text-teal-900 transition-colors duration-500 dark:text-white-50">
                            Logging you into Octopus
                        </h1>
                    </>
                )}
            </main>
        </>
    );
};

export default Login;
