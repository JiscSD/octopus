import { NextPage } from 'next';
import Head from 'next/head';

import * as Templates from '@templates';
import * as Config from '@config';

const Error500: NextPage = () => {
    return (
        <>
            <Head>
                <title>{Config.urls[500].title}</title>
            </Head>
            <Templates.ErrorTemplate
                statusCode={500}
                error="Error: 500"
                title="Internal server error"
                content="There is a problem with the server"
            />
            ;
        </>
    );
};

export default Error500;
