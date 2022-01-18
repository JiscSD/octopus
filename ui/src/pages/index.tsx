import type { NextPage } from 'next';
import Head from 'next/head';

import * as Layouts from '@layouts';

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <meta name="description" content="" />
                <meta name="keywords" content="" />
                <link rel="canonical" href="" />
                <title>Home</title>
            </Head>
            <Layouts.Standard>
                <p>Home</p>
            </Layouts.Standard>
        </>
    );
};

export default Home;
