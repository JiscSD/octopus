import Head from 'next/head';

import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Types from '@types';

const Accessibility: Types.NextPage = (): React.ReactElement => {
    return (
        <>
            <Head>
                <meta name="description" content={Config.urls.accessibility.description} />
                <meta name="keywords" content={Config.urls.accessibility.keywords.join(', ')} />
                <link rel="canonical" href={Config.urls.accessibility.canonical} />
                <title>{Config.urls.accessibility.title}</title>
            </Head>

            <Layouts.Information>
                <section className="mx-auto mb-10 grid grid-cols-1 gap-4 text-grey-900 transition-colors duration-500 dark:text-white lg:w-8/12">
                    <Components.PageTitle text="Accessibility" />
                    <p>This statement applies to content published on </p>
                    <Components.Link
                        className="mb-6 w-fit rounded underline decoration-teal-500 underline-offset-2 outline-0 focus:ring-2 focus:ring-yellow-400"
                        href="https://int.octopus.ac/"
                    >
                        <span>https://int.octopus.ac</span>
                    </Components.Link>
                    <p>
                        This website has been developed by Jisc. It is designed to be used by as many people as
                        possible. The text should be clear and simple to understand. You should be able to:
                    </p>
                    <ul className="ml-6 list-disc">
                        <li>Change colours, contrast levels and fonts</li>
                        <li>Zoom in up to 400% without problems</li>
                        <li>Navigate most of the website using just a keyboard</li>
                        <li>Navigate most of the website using speech recognition software</li>
                        <li>
                            Use most of the website using a screen reader (including the most recent versions of JAWS,
                            NVDA and VoiceOver)
                        </li>
                    </ul>
                    <p className="flex">
                        <Components.Link
                            className="rounded underline decoration-teal-500 underline-offset-2 outline-0 focus:ring-2 focus:ring-yellow-400"
                            openNew
                            href="https://mcmw.abilitynet.org.uk/"
                        >
                            <span>AbilityNet</span>
                        </Components.Link>
                        - has advice on making your device easier to use if you have a disability.
                    </p>
                    <h2 className="mt-10 text-xl font-medium">How accessible is this website</h2>
                    <p>
                        As part of pilot testing, we will be completing full accessibility testing. Improvements will be
                        made throughout this phase. We are not aware of any issues with accessibility.
                    </p>
                    <h2 className="mt-10 text-xl font-medium">
                        How to request content in an accessible format and reporting accessibility problems with this
                        website
                    </h2>
                    <p>
                        If you find any problems that aren&apos;t listed on this page or think we&apos;re not meeting
                        the requirements of the accessibility regulations, please contact{' '}
                        <Components.Link
                            className="mb-4 w-fit rounded underline decoration-teal-500 underline-offset-2 outline-0 focus:ring-2 focus:ring-yellow-400"
                            openNew
                            href="mailto:help@jisc.ac.uk"
                        >
                            <span>help@jisc.ac.uk.</span>
                        </Components.Link>
                    </p>
                    <h2 className="mt-10 text-xl font-medium">How we tested this website</h2>
                    <p>
                        We are continuing to test this site using semi-automated testing tools such as Site Improve and
                        Chrome Lighthouse. As part of pilot testing, we will be completing full accessibility testing.
                    </p>
                    <h2 className="mt-10 text-xl font-medium">What we&apos;re doing to improve accessibility</h2>
                    <p>
                        Whenever new features are released they go through our internal quality assurance checks and
                        must meet WCAG 2.1 AA. We&apos;re also committed to working on the issues above.
                    </p>
                    <p>This statement was prepared on 1 March 2022.</p>
                    <article className="mt-10 flex flex-col gap-1">
                        <p>Content modified from:</p>
                        <Components.Link
                            className="mb-4 w-fit rounded underline decoration-teal-500 underline-offset-2 outline-0 focus:ring-2 focus:ring-yellow-400"
                            openNew
                            href="https://www.gov.uk/help/accessibility-statement"
                        >
                            <span>GOV.UK accessibility statement</span>
                        </Components.Link>
                        <p>Used through the:</p>
                        <Components.Link
                            className="mb-4 w-fit rounded underline decoration-teal-500 underline-offset-2 outline-0 focus:ring-2 focus:ring-yellow-400"
                            openNew
                            href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                        >
                            <span> Open Government Licence v3.0</span>
                        </Components.Link>
                    </article>
                </section>
            </Layouts.Information>
        </>
    );
};

export default Accessibility;
