import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import * as Framer from 'framer-motion';
import * as Components from '@/components';
import * as Layouts from '@/layouts';
import * as Config from '@/config';

type PageSectionProps = {
    children: React.ReactNode;
};

type TextProps = {
    children: React.ReactNode;
    className?: string;
};

const PageSection: React.FC<PageSectionProps> = (props): React.ReactElement => {
    return (
        <Framer.motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring' }}
            className="container mx-auto my-16 mt-10 px-8 transition-all duration-500 lg:mx-auto lg:pt-10 2xl:my-36"
        >
            {props.children}
        </Framer.motion.div>
    );
};

const StandardText: React.FC<TextProps> = (props): React.ReactElement => {
    return (
        <p
            className={`mx-auto mb-5 block font-montserrat text-lg font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100 ${props.className}`}
        >
            {props.children}
        </p>
    );
};

const GetInvolved: NextPage = (): React.ReactElement => (
    <>
        <Head>
            <title>{Config.urls.getInvolved.title}</title>
            <meta name="description" content={Config.urls.getInvolved.description} />
            <meta name="keywords" content={Config.urls.getInvolved.keywords.join(', ')} />
            <meta name="og:title" content={Config.urls.getInvolved.title} />
            <meta name="og:description" content={Config.urls.getInvolved.description} />
            <link rel="canonical" href={Config.urls.getInvolved.canonical} />
        </Head>

        <Layouts.Standard fixedHeader={false}>
            <PageSection>
                <>
                    <div className="mx-auto block lg:w-9/12 xl:w-10/12 2xl:w-7/12">
                        <h1 className="mb-8 block text-center font-montserrat text-3xl font-black !leading-tight tracking-tight text-grey-700 transition-colors duration-500 dark:text-white-50 lg:text-5xl">
                            Get involved with Octopus
                        </h1>
                        <article className="mt-10">
                            <StandardText>
                                This page outlines how you can participate directly in the Octopus project and inform
                                platform development.
                            </StandardText>
                            <StandardText>
                                We are committed to building Octopus in line with user needs, and so will ensure that
                                the research community is engaged at all stages of the project.
                            </StandardText>
                        </article>
                        <article className="mt-10">
                            <Components.PageSubTitle text="Project roadmap" className="text-grey-700" />
                            <StandardText>
                                We launched an initial release of the platform in June 2022. However, this is an
                                iterative project and we are working to add and refine available features and
                                functionality.
                            </StandardText>
                            <StandardText>
                                <>
                                    Our feature roadmap can be viewed here:{' '}
                                    <Components.Link
                                        href="https://eu-rm.roadmunk.com/publish/ed007cbc0353ba9ca7ccde0e80139a88e1796842"
                                        openNew={true}
                                        className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                    >
                                        https://eu-rm.roadmunk.com/publish/ed007cbc0353ba9ca7ccde0e80139a88e1796842
                                    </Components.Link>
                                </>
                            </StandardText>
                            <StandardText className="italic">
                                Please note that the roadmap is provisional. Specific features and timescales are
                                indicative and may be subject to change.
                            </StandardText>
                            <StandardText>
                                <>
                                    If you have any questions, or would like to propose or prioritise a feature, contact
                                    us at{' '}
                                    <Components.Link
                                        href="mailto:help@jisc.ac.uk"
                                        openNew={true}
                                        className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                    >
                                        help@jisc.ac.uk
                                    </Components.Link>
                                    .
                                </>
                            </StandardText>
                        </article>
                        <article className="mt-10">
                            <Components.PageSubTitle text="User community" className="text-grey-700" />
                            <StandardText>
                                The Octopus user community is a collaborative space for the users and builders of
                                Octopus. We use it as a forum to share features under development, co-ordinate user
                                testing, and host meetings to discuss project strategy and development plans.
                            </StandardText>

                            <StandardText>
                                This community is open to researchers globally. It may also be of interest to those in
                                relevant roles within the research lifecycle.
                            </StandardText>

                            <StandardText>
                                <>
                                    To get involved, you can{' '}
                                    <Components.Link
                                        href="https://forms.office.com/Pages/ResponsePage.aspx?id=TTn5SBSKJ02CpvNfEjYSBdQdk25FM49NmnYND3Z_nExUMFBIRU5LU0FZR1Y2RzVCUUIwQzhUVDc4Wi4u"
                                        openNew={true}
                                        className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                    >
                                        request to join our user community Teams site
                                    </Components.Link>
                                    .
                                </>
                            </StandardText>
                        </article>
                        <article className="mt-10">
                            <Components.PageSubTitle text="Critical friends panel" className="text-grey-700" />
                            <StandardText>
                                We have started a critical friends panel comprising research stakeholders willing to
                                feed in to project strategy. This includes representatives from institutions and
                                societies, funders, publishers, and other research systems providers.
                            </StandardText>
                            <StandardText>
                                <>
                                    If you think your organisation would like to participate in Octopus&apos;
                                    development in this way, contact us at{' '}
                                    <Components.Link
                                        href="mailto:help@jisc.ac.uk"
                                        openNew={true}
                                        className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                    >
                                        help@jisc.ac.uk
                                    </Components.Link>
                                    .
                                </>
                            </StandardText>
                        </article>
                        <article className="mt-10">
                            <Components.PageSubTitle text="Mailing Lists" className="text-grey-700" />
                            <StandardText>
                                <>
                                    For regular updates you can join our{' '}
                                    <Components.Link
                                        href="https://www.jiscmail.ac.uk/cgi-bin/wa-jisc.exe?A0=OCTOPUSCOMMUNITY"
                                        openNew={true}
                                        className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                    >
                                        mailing list
                                    </Components.Link>
                                    , or follow us on{' '}
                                    <Components.Link
                                        href="https://twitter.com/science_octopus"
                                        openNew={true}
                                        className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                    >
                                        Twitter
                                    </Components.Link>
                                    .
                                </>
                            </StandardText>
                        </article>
                    </div>
                </>
            </PageSection>
        </Layouts.Standard>
    </>
);

export default GetInvolved;
