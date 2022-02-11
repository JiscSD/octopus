import Head from 'next/head';

import * as Templates from '@templates';
import * as Config from '@config';
import * as Types from '@types';

const Error404: Types.NextPage = () => (
    <>
        <Head>
            <title>{Config.urls[404].title}</title>
        </Head>
        <Templates.ErrorTemplate statusCode={404} title="Page not found." content="Nothing to see here!" />
    </>
);

export default Error404;
