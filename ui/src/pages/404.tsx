import { NextPage } from 'next';
import Head from 'next/head';

import * as Templates from '@templates';
import * as Config from '@config';

const Error404: NextPage = () => {
    return (
        <>
            <Head>
                <title>{Config.urls[404].title}</title>
            </Head>
            <Templates.ErrorTemplate statusCode={404} title="Not found" content="Lorem ipsum" />
        </>
    );
};

export default Error404;
