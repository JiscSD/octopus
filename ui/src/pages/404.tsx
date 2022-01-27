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
            <Templates.ErrorTemplate
                statusCode={404}
                error="Error: 404"
                title="Page not found!"
                content="Oops, this page does not exist."
            />
        </>
    );
};

export default Error404;
