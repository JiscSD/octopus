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
            <Components.TealHeader />
            <div className="bg-teal-100 dark:bg-grey-100 transition-all duration-500 h-48">
                <section>section</section>
            </div>
            <div className="bg-teal-500 dark:bg-grey-500 transition-all duration-500 h-48">
                <section>section</section>
            </div>
            <div className="bg-teal-800 dark:bg-grey-800 transition-all duration-500 h-48">
                <section>section</section>
            </div>
        </>
    );
};

export default Home;
