import Head from 'next/head';

import * as Components from '@/components';
import * as Layouts from '@/layouts';
import * as Config from '@/config';
import * as Types from '@/types';

const CookiePolicy: Types.NextPage = (): React.ReactElement => {
    const headerClasses = 'mb-1 mt-10 text-xl font-medium';
    const paragraphClasses = 'mb-4';
    const baseHeadingCellClasses =
        'whitespace-pre py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6';
    const defaultHeadingCellClasses = baseHeadingCellClasses + 'pr-2';
    const rightHeadingCellClasses = baseHeadingCellClasses + 'pr-4 sm:pr-6';
    const baseCellClasses = 'py-4 pl-4 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6';
    const rightCellClasses = baseCellClasses + 'pr-4 sm:pr-6';
    const defaultCellClasses = baseCellClasses + 'pr-2';
    return (
        <>
            <Head>
                <title>{Config.urls.cookiePolicy.title}</title>
                <meta name="description" content={Config.urls.cookiePolicy.description} />
                <meta name="og:title" content={Config.urls.cookiePolicy.title} />
                <meta name="og:description" content={Config.urls.cookiePolicy.description} />
                <meta name="keywords" content={Config.urls.cookiePolicy.keywords.join(', ')} />
                <link rel="canonical" href={Config.urls.cookiePolicy.canonical} />
            </Head>
            <Layouts.Information>
                <Components.PageTitle text={Config.urls.cookiePolicy.title} />
                <h2 className={headerClasses}>About cookies</h2>
                <p className={paragraphClasses}>
                    To help improve this site we place small files, known as cookies, onto your computer. All of the
                    cookies we use are essential for the site to work properly.
                </p>
                <h2 className={headerClasses}>How we use cookies</h2>
                <p className={paragraphClasses}>We use cookies only for essential purposes on this website.</p>
                <h2 className={headerClasses}>Essential cookies</h2>
                <p className={paragraphClasses}>
                    The system that runs our website sets cookies to allow it to run smoothly.
                </p>
                <div className="mb-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-transparent rounded-lg">
                    <table className="min-w-full divide-y divide-grey-100 dark:divide-teal-300">
                        <thead className="bg-grey-50 transition-colors duration-500 dark:bg-grey-700">
                            <tr>
                                <th className={defaultHeadingCellClasses}>Name</th>
                                <th className={defaultHeadingCellClasses}>Purpose</th>
                                <th className={rightHeadingCellClasses}>Expires</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-grey-100 bg-white-50 transition-colors duration-500 dark:divide-teal-300 dark:bg-grey-600">
                            <tr>
                                <td className={defaultCellClasses}>production-octopus-token</td>
                                <td className={defaultCellClasses}>Used to store your login token</td>
                                <td className={rightCellClasses}>8 hours</td>
                            </tr>
                            <tr>
                                <td className={defaultCellClasses}>AWSALB</td>
                                <td className={defaultCellClasses}>
                                    Used to make sure the website can cope with unexpected traffic
                                </td>
                                <td className={rightCellClasses}>7 days</td>
                            </tr>
                            <tr>
                                <td className={defaultCellClasses}>AWSALBCORS</td>
                                <td className={defaultCellClasses}>
                                    Used to make sure the website can cope with unexpected traffic
                                </td>
                                <td className={rightCellClasses}>7 days</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className={paragraphClasses}>
                    NB: Cookie guidance wording adapted from{' '}
                    <Components.Link href="http://www.gov.uk/help/cookies" openNew className="underline">
                        cookies on gov.uk
                    </Components.Link>
                    , shared under the{' '}
                    <Components.Link
                        href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                        openNew
                        className="underline"
                    >
                        Open Government Licence
                    </Components.Link>
                    .
                </p>
                <p className={paragraphClasses + ' font-bold'}>Last updated: 11 Feb 2025.</p>
            </Layouts.Information>
        </>
    );
};

export default CookiePolicy;
