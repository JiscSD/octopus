import type { NextPage } from 'next';
import Head from 'next/head';

import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Components from '@components';

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <meta name="description" content={Config.urls.home.description} />
                <meta name="keywords" content={Config.urls.home.keywords} />
                <link rel="canonical" href={Config.urls.home.canonical} />
                <title>{Config.urls.home.title}</title>
            </Head>
            <Layouts.Standard>
                <Components.TealHeader />
                <p>Home</p>
            </Layouts.Standard>
        </>
    );
};

export default Home;
