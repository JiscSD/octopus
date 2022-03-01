import Head from 'next/head';

import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Types from '@types';

const Legal: Types.NextPage = (): JSX.Element => {
    return (
        <>
            <Head>
                <meta name="description" content={`${Config.urls.legal.description}`} />
                <meta name="keywords" content={`${Config.urls.legal.keywords}`} />
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
                    <section className="container mx-auto px-8 pt-8 lg:gap-4 lg:pt-36">
                        <div className="mx-auto mb-10 grid grid-cols-1 gap-4 text-grey-900 dark:text-white lg:w-8/12">
                            <Components.PageTitle text="Legal" />
                            <h2 className="mt-10 text-xl font-medium">Legal placeholder</h2>
                            <p>Placeholder</p>
                        </div>
                    </section>
                </Components.SectionTwo>
            </Layouts.Standard>
        </>
    );
};

export default Legal;
