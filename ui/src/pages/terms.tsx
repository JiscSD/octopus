import Head from 'next/head';

import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Types from '@types';

const Terms: Types.NextPage = (): JSX.Element => {
    return (
        <>
            <Head>
                <meta name="description" content={Config.urls.terms.description} />
                <meta name="keywords" content={Config.urls.terms.keywords.join(', ')} />
                <link rel="canonical" href={Config.urls.terms.canonical} />
                <title>{Config.urls.terms.title}</title>
            </Head>

            <Layouts.Standard fixedHeader={true}>
                <Components.SectionTwo
                    className="bg-teal-50 dark:bg-grey-800"
                    waveFillTop="fill-teal-100 dark:fill-grey-500 transition-colors duration-500"
                    waveFillMiddle="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                    waveFillBottom="fill-teal-700 dark:fill-grey-800 transition-colors duration-500"
                >
                    <section className="container mx-auto px-8 pt-8 lg:gap-4 lg:pt-48">
                        <div className="mx-auto mb-10 grid grid-cols-1 gap-4 text-grey-900 transition-colors duration-500 dark:text-white lg:w-8/12">
                            <Components.PageTitle text="Terms" />
                            <h2 className="text-xl font-medium">Licence</h2>
                            <p className="mb-4">
                                This project code is licensed under the GNU General Public Licence v3.0.
                            </p>
                            <p>The full text of the licence can be found here:</p>
                            <Components.Link
                                className="mb-4 w-fit rounded underline decoration-teal-500 underline-offset-2 outline-0 focus:ring-2 focus:ring-yellow-400"
                                openNew
                                href="https://www.gnu.org/licenses/gpl-3.0.en.html"
                            >
                                <span>https://www.gnu.org/licenses/gpl-3.0.en.html</span>
                            </Components.Link>
                            {/* <h3 className="text-lg font-medium">Disclaimer</h3>
                                <p>Placeholder for legal content</p> */}
                        </div>
                    </section>
                </Components.SectionTwo>
            </Layouts.Standard>
        </>
    );
};

export default Terms;
