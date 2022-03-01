import Head from 'next/head';

import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Types from '@types';

const Privacy: Types.NextPage = (): JSX.Element => {
    return (
        <>
            <Head>
                <meta name="description" content={`${Config.urls.privacy.description}`} />
                <meta name="keywords" content={`${Config.urls.privacy.keywords}`} />
                <link rel="canonical" href={`${Config.urls.privacy.canonical}`} />
                <title>{Config.urls.privacy.title}</title>
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
                            <Components.PageTitle text="Privacy" />
                            <h2 className="mt-10 text-xl font-medium">Privacy placeholder</h2>
                            <p>
                                Jisc privacy notice -
                                <Components.Link
                                    openNew
                                    className="mb-6 rounded underline decoration-teal-500 underline-offset-2 outline-0 focus:ring-2 focus:ring-yellow-400"
                                    href="https://www.jisc.ac.uk/website/privacy-notice"
                                >
                                    <span>https://www.jisc.ac.uk/website/privacy-notice</span>
                                </Components.Link>
                            </p>
                        </div>
                    </section>
                </Components.SectionTwo>
            </Layouts.Standard>
        </>
    );
};

export default Privacy;
