import Head from 'next/head';

import * as Templates from '@templates';
import * as Config from '@config';
import * as Types from '@types';

const Error500: Types.NextPage = () => (
    <>
        <Head>
            <title>{Config.urls[500].title}</title>
        </Head>
        <Templates.ErrorTemplate
            statusCode={500}
            title="Internal server error"
            content="There is a problem with the server"
        />
        ;
    </>
);

export default Error500;
