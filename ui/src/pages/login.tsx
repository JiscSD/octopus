import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import * as Helpers from '@helpers';
import * as Assets from '@assets';
import * as Stores from '@stores';
import * as Config from '@config';
import * as Types from '@types';
import * as api from '@api';
import * as Components from '@components';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const defaultErrorMessage = 'Something went wrong. Please try again!';
    const homeUrl = encodeURIComponent(Config.urls.home.path);
    const { code = null, state: redirectTo = homeUrl, error = null } = context.query;
    let token: string | null = null;

    if (!code || error) {
        return {
            props: {
                token,
                redirectTo,
                error: defaultErrorMessage
            }
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
        if (process.env.NODE_ENV === 'development') {
            console.log(error);
        }
    }

    if (!token) {
        return {
            props: {
                token,
                redirectTo,
                error: defaultErrorMessage
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

    useEffect(() => {
        if (props.token) {
            const decodedJWT = Helpers.setAndReturnJWT(props.token) as Types.UserType;
            if (decodedJWT) {
                setUser(Object.assign(decodedJWT, { token: props.token }));
            }
            setTimeout(() => router.push(decodeURIComponent(props.redirectTo)), 1000);
        }
    }, [props.redirectTo, props.token, router, setUser]);

    return (
        <>
            <Head>
                <meta name="robots" content="noindex" />
                <title>{Config.urls.orcidLoginCallback.title}</title>
            </Head>

            <main className="container flex h-screen w-full flex-col items-center justify-center bg-white-50 px-8 text-center dark:bg-grey-800">
                {props.error ? (
                    <>
                        <h1 className="mb-4 block font-montserrat text-lg font-semibold text-grey-800 dark:text-white-50">
                            {props.error}
                        </h1>
                        <Components.Link
                            href={`${Config.urls.orcidLogin.path}&state=${props.redirectTo}`}
                            ariaLabel="Sign in with ORCID"
                            className="flex items-center rounded-md bg-orcid py-2 px-4"
                        >
                            <Assets.ORCID width={20} height={20} className="fill-white-50" />
                            <span className="ml-2 text-xs text-white-50">Sign in with ORCID</span>
                        </Components.Link>
                    </>
                ) : (
                    <>
                        {darkMode ? (
                            <Assets.LogoDark height={100} width={100} className="animate-bounce" />
                        ) : (
                            <Assets.LogoLight height={100} width={100} className="animate-bounce" />
                        )}
                        <h1 className="mb-4 block font-montserrat text-lg font-semibold text-grey-800 dark:text-white-50">
                            Logging you into Octopus
                        </h1>
                    </>
                )}
            </main>
        </>
    );
};

export default Login;
