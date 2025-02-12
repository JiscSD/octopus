import Head from 'next/head';

import * as Components from '@/components';
import * as Layouts from '@/layouts';
import * as Config from '@/config';
import * as Types from '@/types';

const Terms: Types.NextPage = (): React.ReactElement => {
    return (
        <>
            <Head>
                <title>{Config.urls.terms.title}</title>
                <meta name="description" content={Config.urls.terms.description} />
                <meta name="og:title" content={Config.urls.terms.title} />
                <meta name="og:description" content={Config.urls.terms.description} />
                <meta name="keywords" content={Config.urls.terms.keywords.join(', ')} />
                <link rel="canonical" href={Config.urls.terms.canonical} />
            </Head>

            <Layouts.Information>
                <Components.PageTitle text="Terms" />
                <h2 className="text-xl font-medium">Licence</h2>
                <p className="mb-4">This project code is licensed under the GNU General Public Licence v3.0.</p>
                <p>The full text of the licence can be found here:</p>
                <Components.Link
                    className="mb-4 w-fit rounded underline decoration-teal-500 underline-offset-2 outline-0 focus:ring-2 focus:ring-yellow-400"
                    openNew
                    href="https://www.gnu.org/licenses/gpl-3.0.en.html"
                >
                    <span>https://www.gnu.org/licenses/gpl-3.0.en.html</span>
                </Components.Link>
            </Layouts.Information>
        </>
    );
};

export default Terms;
