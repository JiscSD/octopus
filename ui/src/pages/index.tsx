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
                <Components.Section id="home-search" className="bg-teal-50 dark:bg-grey-600">
                    <div className="container mx-auto px-8"></div>
                </Components.Section>
                <Components.SectionTwo id="another" className="bg-teal-400 dark:bg-grey-700">
                    <div className="container mx-auto px-8"></div>
                </Components.SectionTwo>
                <Components.Section id="home-search" className="bg-teal-100 dark:bg-grey-600">
                    <div className="container mx-auto px-8"></div>
                </Components.Section>
            </Layouts.Standard>
        </>
    );
};

export default Home;
