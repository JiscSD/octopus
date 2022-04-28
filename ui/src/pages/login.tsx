import React from 'react';
import Head from 'next/head';
import * as Router from 'next/router';

import * as Interfaces from '@interfaces';
import * as Helpers from '@helpers';
import * as Assets from '@assets';
import * as Stores from '@stores';
import * as Config from '@config';
import * as Types from '@types';
import * as api from '@api';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    let code: string | string[] | null = null;
    let token: any = null;
    let error: string | null = null;
    let redirect: string | string[] | null = null;

    if (context.query.code) code = context.query.code;
    if (context.query.state) redirect = context.query.state;

    if (!code) {
        return {
            notFound: true
        };
    }

    if (Array.isArray(code)) code = code[0];

    if (Array.isArray(redirect)) {
        redirect = redirect[0];
    } else if (redirect) {
        redirect = Buffer.from(redirect || '', 'base64').toString('utf-8');
    }

    try {
        const response = await api.post(
            `${Config.endpoints.authorization}`,
            {
                code
            },
            undefined
        );
        token = response.data;
    } catch (err) {
        const { message } = err as Interfaces.JSONResponseError;
        error = message;
    }

    if (!token || error) {
        return {
            notFound: true
        };
    }

    return {
        props: { token, redirect: redirect || Config.urls.home.path }
    };
};

type Props = {
    token: string;
    redirect: string;
};

const Login: Types.NextPage<Props> = (props): React.ReactElement => {
    const router = Router.useRouter();
    const setUser = Stores.useAuthStore((state) => state.setUser);

    React.useEffect(() => {
        const decodedJWT = Helpers.setAndReturnJWT(props.token);
        // @ts-ignore
        if (decodedJWT) setUser({ ...decodedJWT, token: props.token });
        setTimeout(() => router.push(props.redirect), 300);
    }, [props.token]);

    return (
        <>
            <Head>
                <meta name="robots" content="noindex" />
                <title>{Config.urls.orcidLoginCallback.title}</title>
            </Head>

            <main className="flex h-screen w-full flex-col items-center justify-center bg-white-50 dark:bg-grey-800">
                <Assets.Logo width={100} height={100} className="block animate-bounce fill-teal-500" />
                <h1 className="mb-4 block font-montserrat text-lg font-semibold text-grey-800 dark:text-white-50">
                    Logging you into Octopus
                </h1>
            </main>
        </>
    );
};

export default Login;
