import React from 'react';
import Head from 'next/head';
import * as Router from 'next/router';
// import jwt_decode from 'jwt-decode';
// import Cookies from 'js-cookie';

import * as Components from '@components';
import * as Interfaces from '@interfaces';
import * as Layouts from '@layouts';
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
        router.push({
            pathname: `${Config.urls.home.path}`
        });
    }, []);

    return (
        <>
            <Head>
                <meta name="description" content="" />
                <meta name="keywords" content="" />
                <link rel="canonical" href={`${Config.urls.orcidLoginCallback.canonical}`} />
                <title>{Config.urls.orcidLoginCallback.title}</title>
            </Head>

            <Layouts.Standard fixedHeader={true}>
                <Components.SectionTwo
                    className="bg-teal-50 dark:bg-grey-800"
                    waveFillTop="fill-teal-100 dark:fill-grey-500 transition-colors duration-500"
                    waveFillMiddle="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                    waveFillBottom="fill-teal-700 dark:fill-grey-800 transition-colors duration-500"
                >
                    <section className="container mx-auto grid grid-cols-1 px-8 pt-8 lg:grid-cols-3 lg:gap-4 lg:pt-36">
                        Loading...
                    </section>
                </Components.SectionTwo>
            </Layouts.Standard>
        </>
    );
};

export default Callback;
