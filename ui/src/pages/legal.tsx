import { NextPage } from 'next';
import Head from 'next/head';

import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Config from '@config';

const Legal: NextPage = (): JSX.Element => {
    return (
        <>
            <Head>
                <meta name="description" content="" />
                <meta name="keywords" content="" />
                <link rel="canonical" href={`${Config.urls.legal.canonical}`} />
                <title>{Config.urls.legal.title}</title>
            </Head>

            <Layouts.Standard fixedHeader={true}>
                <Components.SectionTwo
                    className="bg-teal-50 dark:bg-grey-800"
                    waveFillTop="fill-teal-100 dark:fill-grey-500 transition-colors duration-500"
                    waveFillMiddle="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                    waveFillBottom="fill-teal-700 dark:fill-grey-800 transition-colors duration-500"
                >
                    <section className="container mx-auto grid grid-cols-1 px-8 pt-8 lg:grid-cols-3 lg:gap-4 lg:pt-36">
                        <h1>Legal</h1>
                    </section>
                </Components.SectionTwo>
            </Layouts.Standard>
        </>
    );
};

export default Legal;
