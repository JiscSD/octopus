import Head from 'next/head';

import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Types from '@types';

const Privacy: Types.NextPage = (): React.ReactElement => {
    return (
        <>
            <Head>
                <meta name="description" content={Config.urls.privacy.description} />
                <meta name="keywords" content={Config.urls.privacy.keywords.join(', ')} />
                <link rel="canonical" href={Config.urls.privacy.canonical} />
                <title>{Config.urls.privacy.title}</title>
            </Head>

            <Layouts.Information>
                <section className="mx-auto mb-10 grid grid-cols-1 gap-4 text-grey-900 transition-colors duration-500 dark:text-white lg:w-8/12">
                    <Components.PageTitle text="Privacy" />
                    <p>
                        We&apos;ll use it, as described in{' '}
                        <Components.Link
                            openNew
                            className="rounded underline decoration-teal-500 underline-offset-2 outline-0 focus:ring-2 focus:ring-yellow-400"
                            href="https://www.jisc.ac.uk/website/privacy-notice"
                        >
                            <span>Jisc&apos;s privacy notice</span>
                        </Components.Link>
                        , to provide the service you&apos;ve requested, as well as to identify problems or ways to make
                        the service better. We will retain the anonymised usage information indefinitely.
                    </p>
                    <h2 className="mb-1 mt-10 text-xl font-medium">User accounts</h2>
                    <p className="mb-4">
                        The following information is needed for us to set up your Octopus account and communicate with
                        you as an Octopus user:
                    </p>
                    <ul className="mb-4 ml-6 list-disc">
                        <li>Name (via ORCID)</li>
                        <li>Affiliation (via ORCID)</li> <li>Current email address</li>
                    </ul>
                    <p className="mb-4">
                        Octopus accounts must be linked to an{' '}
                        <Components.Link
                            openNew
                            className="rounded underline decoration-teal-500 underline-offset-2 outline-0 focus:ring-2 focus:ring-yellow-400"
                            href="https://orcid.org/"
                        >
                            <span>ORCID account.</span>
                        </Components.Link>{' '}
                        When you create an account on this service you are granting Octopus:
                    </p>
                    <ul className="mb-4 ml-6 list-disc">
                        <li>
                            Access to your public ORCID information, such as name, affiliation(s), and publications.
                        </li>
                        <li>Permission to display this public information on your Octopus user account </li>
                        <li>
                            Permission to update your ORCID public information to display any publications created on
                            Octopus
                        </li>
                    </ul>
                    <p className="mb-4">
                        As well as data from ORCID, all user activity (such as submitted content, ratings, red flags,
                        and related publications), is stored by Jisc and will be displayed on your public user profile.
                    </p>
                    <p className="mb-4">
                        We&apos;ll keep the information until we are told that you no longer wish to use the service. If
                        you wish to delete your Octopus user account, you can email{' '}
                        <Components.Link
                            openNew
                            className="rounded underline decoration-teal-500 underline-offset-2 outline-0 focus:ring-2 focus:ring-yellow-400"
                            href="mailto:help@jisc.ac.uk"
                        >
                            <span>help@jisc.ac.uk </span>
                        </Components.Link>
                        and we will remove your individual account and personal information. However, please note that
                        unless otherwise agreed we would not as standard delete any publications affiliated with this
                        account.
                    </p>
                </section>
            </Layouts.Information>
        </>
    );
};

export default Privacy;
