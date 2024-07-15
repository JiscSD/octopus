import Head from 'next/head';

import * as Components from '@/components';
import * as Layouts from '@/layouts';
import * as Config from '@/config';
import * as Types from '@/types';

const Accessibility: Types.NextPage = (): React.ReactElement => {
    return (
        <>
            <Head>
                <title>{Config.urls.accessibility.title}</title>
                <meta name="description" content={Config.urls.accessibility.description} />
                <meta name="og:title" content={Config.urls.accessibility.title} />
                <meta name="og:description" content={Config.urls.accessibility.description} />
                <meta name="keywords" content={Config.urls.accessibility.keywords.join(', ')} />
                <link rel="canonical" href={Config.urls.accessibility.canonical} />
            </Head>

            <Layouts.Information>
                <section className="mx-auto mb-10 grid grid-cols-1 gap-4 text-grey-900 transition-colors duration-500 dark:text-white-50 lg:w-8/12">
                    <Components.PageTitle text="Accessibility statement for Octopus.ac" />
                    <p>
                        This statement applies to content published on{' '}
                        <Components.Link
                            className="mb-6 w-fit rounded underline decoration-teal-500 underline-offset-2 outline-0 focus:ring-2 focus:ring-yellow-400"
                            href={Config.urls.home.path}
                        >
                            https://www.octopus.ac
                        </Components.Link>
                    </p>
                    <p>
                        This website has been developed by Jisc. It is designed to be used by as many people as
                        possible. The text should be clear and simple to understand. You should be able to:
                    </p>
                    <ul className="ml-6 list-disc">
                        <li>Change colours, contrast levels and fonts.</li>
                        <li>Zoom in up to 400% without problems.</li>
                        <li>Navigate most of the website using just a keyboard.</li>
                        <li>Navigate most of the website using speech recognition software.</li>
                        <li>
                            Use most of the website using a screen reader (including the most recent versions of JAWS,
                            NVDA and VoiceOver).
                        </li>
                    </ul>
                    <p>
                        <Components.Link
                            className="rounded underline decoration-teal-500 underline-offset-2 outline-0 focus:ring-2 focus:ring-yellow-400"
                            openNew
                            href="https://mcmw.abilitynet.org.uk/"
                        >
                            AbilityNet
                        </Components.Link>{' '}
                        has advice on making your device easier to use if you have a disability.
                    </p>
                    <h2 className="mt-10 text-xl font-semibold">How accessible this website is</h2>
                    <p>We know some parts of this website are not fully accessible:</p>
                    <ul className="ml-6 list-disc">
                        <li>
                            The publication page&apos;s navigation tool does not provide context on how different
                            publications are related to each-other.
                        </li>
                        <li>Skip links are not functional on most pages.</li>
                        <li>
                            Informational links typically do not have markups to explain their purpose when focusing
                            them with a screen reader.
                        </li>
                    </ul>
                    <h2 className="mt-10 text-xl font-semibold">Feedback and contact information</h2>
                    <p>
                        If you find any problems that aren&apos;t listed on this page or think we&apos;re not meeting
                        the requirements of the accessibility regulations, please contact{' '}
                        <Components.Link
                            className="mb-4 w-fit rounded underline decoration-teal-500 underline-offset-2 outline-0 focus:ring-2 focus:ring-yellow-400"
                            openNew
                            href="mailto:help@jisc.ac.uk"
                        >
                            help@jisc.ac.uk.
                        </Components.Link>
                    </p>
                    <p>
                        If you need information on this website in a different format like accessible PDF, large print,
                        easy read, audio recording or braille please contact{' '}
                        <Components.Link
                            className="mb-4 w-fit rounded underline decoration-teal-500 underline-offset-2 outline-0 focus:ring-2 focus:ring-yellow-400"
                            openNew
                            href="mailto:help@jisc.ac.uk"
                        >
                            help@jisc.ac.uk.
                        </Components.Link>
                    </p>
                    <p>We&apos;ll consider your request and get back to you in 7 days.</p>
                    <h2 className="mt-10 text-xl font-semibold">Enforcement procedure</h2>
                    <p>
                        The Equality and Human Rights Commission (EHRC) is responsible for enforcing the Public Sector
                        Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018 (the
                        &apos;accessibility regulations&apos;). If you&apos;re not happy with how we respond to your
                        complaint,{' '}
                        <Components.Link
                            className="mb-4 w-fit rounded underline decoration-teal-500 underline-offset-2 outline-0 focus:ring-2 focus:ring-yellow-400"
                            openNew
                            href="https://www.equalityadvisoryservice.com/"
                        >
                            contact the Equality Advisory and Support Service (EASS)
                        </Components.Link>
                        .
                    </p>
                    <h2 className="mt-10 text-xl font-semibold">
                        Technical information about this website&apos;s accessibility
                    </h2>
                    <p>
                        Jisc is committed to making its website accessible, in accordance with the Public Sector Bodies
                        (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018.
                    </p>
                    <h3 className="mt-8 text-lg font-semibold">Compliance status</h3>
                    <p>
                        This website is partially compliant with the{' '}
                        <Components.Link
                            className="mb-4 w-fit rounded underline decoration-teal-500 underline-offset-2 outline-0 focus:ring-2 focus:ring-yellow-400"
                            openNew
                            href="https://www.w3.org/TR/WCAG21/"
                        >
                            Web Content Accessibility Guidelines version 2.1
                        </Components.Link>{' '}
                        AA standard due to the non-compliances and exemptions listed below.
                    </p>
                    <h2 className="mt-10 text-xl font-semibold">Non-accessible content</h2>
                    <p>The content listed below is non-accessible for the following reasons.</p>
                    <h3 className="mt-8 text-lg font-semibold">Non-compliance with the accessibility regulations</h3>
                    <h4 className="mt-6 font-semibold">1.1.1 Non-text Content (Level A)</h4>
                    <p>Certain icons on the draft edit page do not have a label or other text-based alternative.</p>
                    <h4 className="mt-6 font-semibold">
                        1.3.1 Info and Relationships (Level A), 2.4.6 Headings and Labels (Level AA), 3.3.2 Labels or
                        Instructions (Level A), 4.1.2 Name, Role, Value (Level A)
                    </h4>
                    <p>
                        The information structure of certain elements such as affiliations or linked publications are
                        not effectively conveyed to screen readers.
                    </p>
                    <p>
                        Changes in the structure of the affiliations table based upon user input are not marked up to
                        announce the change.
                    </p>
                    <p>
                        Many fields on the draft edit page are not marked up with a label, although placeholder text is
                        present to explain their purpose in most cases.
                    </p>
                    <p>Certain fields are not marked up with their semantic purpose.</p>
                    <p>Several lists on publication pages do not convey details about the list's structure.</p>
                    <p>
                        The "Main Text" and "References" fields on the draft edit page do not convey their purpose to
                        screen readers. Some modals, such as the “Red flag publication” modal do not announce their name
                        to screen readers.
                    </p>
                    <h4 className="mt-6 font-semibold">1.3.3 Sensory Characteristics (Level A)</h4>
                    <p>The completion of sections on the draft edit page is only indicated via icon colour & shape.</p>
                    <h4 className="mt-6 font-semibold">2.4.1 Bypass Blocks (Level A)</h4>
                    <p>
                        Skip links to access main content do not function correctly, and additional skip links should be
                        added to avoid unnecessary navigation to reach interactive elements of the publication page.
                    </p>
                    <h4 className="mt-6 font-semibold">2.4.4 Link Purpose (In Context) (Level A)</h4>
                    <p>
                        Many links on informational pages and on the draft edit page do not provide sufficient
                        information about their purpose, requiring the user to gather context from the surrounding page.
                    </p>
                    <h4 className="mt-6 font-semibold">1.3.5 Identify Input Purpose (Level AA)</h4>
                    <p>Fields to enter organisation name do not have their semantic purpose correctly recorded.</p>
                    <h4 className="mt-6 font-semibold">1.4.3 Contrast (Minimum) (Level AA)</h4>
                    <p>
                        Red asterisks used to denote mandatory fields are presented on the "Flag a concern" model as
                        small text without sufficient contrast (3.78:1).
                    </p>
                    <p>
                        DOI text publications listed on the account page on light mode is small and has insufficient
                        contrast (3.79:1).
                    </p>
                    <p>Publication type text on the account page has insufficient contrast on dark mode (3.05:1).</p>
                    <h4 className="mt-6 font-semibold">3.1.2 Language of Parts (Level AA)</h4>
                    <p>Publication text is not marked up as being in the language it was written in.</p>
                    <h4 className="mt-6 font-semibold">3.2.4 Consistent Identification (Level AA)</h4>
                    <p>
                        Publication title is described differently by assistive technology on the "publish" page
                        compared with the draft edit page.
                    </p>
                    <h4 className="mt-6 font-semibold">3.3.3 Error Suggestion (Level AA)</h4>
                    <p>
                        Error banners that advise a correction, such as the one that appears when a user enters an
                        invalid URL for a funder, or an invalid email for a co-author are displayed to the user advising
                        of the issue but are not announced to screen readers.
                    </p>
                    <h4 className="mt-6 font-semibold">4.1.3 Status Messages (Level AA)</h4>
                    <p>
                        Error banners do not have a role=alert markup. This includes both programmatic errors, such as
                        403, "Publication is already locked", and so on, as well as user input errors, such as an
                        invalid URL for a funder, or an invalid email for a co-author.
                    </p>
                    <h3 className="mt-8 text-lg font-semibold">Disproportionate Burden</h3>
                    <h4 className="mt-6 font-semibold">User uploaded content</h4>
                    <p>
                        Whilst authors are provided with tools that allow them to create accessible publications, we do
                        not have any direct oversight of the content they upload, nor power to modify it. User uploaded
                        content on any publication page (at a URL beginning with https://www.octopus.ac/publications/)
                        may not conform with accessibility guidelines.
                    </p>
                    <p>
                        Possible examples of non-accessible content include images without explanatory alt-text (1.1.1
                        Non-text content), relationships and information conveyed by shape, position and other
                        characteristics that cannot be conveyed to assistive technology (1.3.1 Info and relationships),
                        and links that do not provide context about their purpose (2.4.4 Link Purpose).
                    </p>
                    <p>
                        It is not within our power to compel users to upload accessible content, and we do not have any
                        form of manual intervention in the publishing process. As such, we believe that the time,
                        resources, and complexity of auditing each draft before publication to suggest modifications
                        represents a disproportionate burden within the meaning of the accessibility regulations. We
                        will endeavour to provide features and guidance to authors to encourage them to upload
                        accessible publications.
                    </p>
                    <h2 className="mt-10 text-xl font-semibold">What we&apos;re doing to improve accessibility</h2>
                    <p>
                        Whenever new features are released, they go through our internal quality assurance checks and
                        must meet WCAG 2.1 A & AA guidelines. We're also committed to working on the issues above and
                        aim to have all known issues resolved by mid-2025.
                    </p>
                    <p>
                        Improvements are being made both as a part of routine development, and as dedicated exercises.
                        Accessibility is considered as a priority for all features developed for the platform.
                    </p>
                    <h2 className="mt-10 text-xl font-semibold">Preparation of this accessibility statement</h2>
                    <p>This statement was prepared on 3 Nov 2023. It was last reviewed on 25 Jun 2024.</p>
                    <p>This website was last tested on 25 Jun 2024.</p>
                    <p>
                        The test was carried out by Jisc staff, using semi-automated testing tools such as Site Improve,
                        Chrome Lighthouse and WAVE Evaluation tool. Manual accessibility testing was conducted on Chrome
                        & Edge using NVDA screen reader, and TPGI&apos;s colour contrast analyser on Windows 11.
                    </p>
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
