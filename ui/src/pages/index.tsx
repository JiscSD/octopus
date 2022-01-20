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
            <Layouts.Standard fixedHeader={true}>
                <Components.Section
                    className="bg-teal-50 dark:bg-grey-600"
                    wave={true}
                    waveFill="fill-teal-50 dark:fill-grey-600"
                >
                    <div className="container mx-auto px-8">
                        <div className="block mx-auto lg:w-2/3 2xl:w-1/2">
                            <Components.Search />
                        </div>
                    </div>
                </Components.Section>
                <Components.Section
                    className="bg-teal-200 dark:bg-grey-700"
                    wave={true}
                    waveFill="fill-teal-200 dark:fill-grey-700"
                >
                    <div className="container mx-auto px-8">
                        <p>Section placeholder</p>
                    </div>
                </Components.Section>
                <Components.Section
                    className="bg-teal-800 dark:bg-grey-800"
                    wave={true}
                    waveFill="fill-teal-800 dark:fill-grey-800"
                >
                    <div className="container mx-auto px-8">
                        <p>Section placehodler</p>
                    </div>
                </Components.Section>
                <Components.Section
                    className="bg-teal-200 dark:bg-grey-700"
                    wave={true}
                    waveFill="fill-teal-200 dark:fill-grey-700"
                >
                    <div className="container mx-auto px-8">
                        <p>Section placeholder</p>
                    </div>
                </Components.Section>
            </Layouts.Standard>
        </>
    );
};

export default Home;
