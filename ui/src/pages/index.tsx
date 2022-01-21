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
                <Components.Section
                    id="home-search"
                    className="bg-teal-50 dark:bg-grey-800"
                    waveFillTop="fill-teal-100 dark:fill-grey-500 transition-colors duration-500"
                    waveFillMiddle="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                    waveFillBottom="fill-teal-300 dark:fill-grey-900 transition-colors duration-500"
                >
                    <div className="container mx-auto px-8 dark:text-white">
                        <p className="p-10">Hello and welcome to</p>
                        <p className="p-10 font-bold">Octopus</p>
                    </div>
                </Components.Section>
                <Components.SectionTwo
                    id="home-search"
                    className="bg-teal-300 dark:bg-grey-900"
                    waveFillTop="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                    waveFillMiddle="fill-teal-100 dark:fill-grey-700 transition-colors duration-500"
                    waveFillBottom="fill-teal-50 dark:fill-grey-800 transition-colors duration-500"
                >
                    <div className="container mx-auto px-8 dark:text-white">
                        <p className="p-10">Hello and welcome to</p>
                        <p className="p-10 font-bold">Octopus</p>
                    </div>
                </Components.SectionTwo>
                <Components.Section
                    id="third"
                    className="bg-teal-50 dark:bg-grey-800"
                    waveFillTop="fill-teal-500 dark:fill-grey-600 transition-colors duration-500"
                    waveFillMiddle="fill-teal-600 dark:fill-grey-700 transition-colors duration-500"
                    waveFillBottom="fill-teal-700 dark:fill-grey-900 transition-colors duration-500"
                >
                    <div className="container mx-auto px-8 dark:text-white">
                        <p className="p-10">Hello and welcome to</p>
                        <p className="p-10 font-bold">Octopus</p>
                    </div>
                </Components.Section>
            </Layouts.Standard>
        </>
    );
};

export default Home;
