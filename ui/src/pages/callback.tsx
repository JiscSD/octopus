import React from 'react';
import Head from 'next/head';
import * as Router from 'next/router';

import * as Interfaces from '@interfaces';
import * as Assets from '@assets';
import * as Stores from '@stores';
import * as Config from '@config';
import * as Types from '@types';

import * as API from '@api';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    let code: string | string[] | null = null;
    let token: any = null;
    let error: string | null = null;

    // Ensure we have a set code
    if (context.query.code) code = context.query.code;

    // No code query param, no processable
    if (!code) {
        return {
            notFound: true
        };
    }

    // Ensure we only use one query param of code, the first
    if (Array.isArray(code)) code = code[0];

    try {
        const response = await API.post(`${Config.endpoints.authorization}`, {
            code
        });
        token = response.data;
        console.log(token);
    } catch (err) {
        const { message } = err as Interfaces.JSONResponseError;
        error = message;
        console.log(error);
    }

    if (!token || error) {
        return {
            notFound: true
        };
    }

    // At this point we have the user object, but we will expect a jwt token.
    return {
        props: { token }
    };
};

type Props = {
    token: string; // TODO: Need a really good interface for the shape of user
};

const Callback: Types.NextPage<Props> = (props): JSX.Element => {
    const router = Router.useRouter();
    const setUser = Stores.useAuthStore((state: Types.AuthStoreType) => state.setUser);

    React.useEffect(() => {
        setUser(props.token);
        setTimeout(
            () =>
                router.push({
                    pathname: `${Config.urls.home.path}`
                }),
            800
        );
    }, []);

    return (
        <>
            <Head>
                <meta name="robots" content="noindex" />
                <title>{Config.urls.orcidLoginCallback.title}</title>
            </Head>

            <main className="flex h-screen w-full flex-col items-center justify-center bg-teal-50 dark:bg-grey-800">
                <Assets.Logo width={100} height={100} className="block animate-bounce fill-teal-500" />
                <h1 className="mb-4 block font-montserrat text-lg font-semibold text-grey-800 dark:text-white">
                    Logging in verification text here...
                </h1>
            </main>
        </>
    );
};

export default Callback;
