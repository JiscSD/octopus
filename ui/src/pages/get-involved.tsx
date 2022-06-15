import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import * as Framer from 'framer-motion';

import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Config from '@config';

type PageSectionProps = {
    children: React.ReactChildren | React.ReactChild | React.ReactElement;
};

type TextProps = {
    children: React.ReactChildren | React.ReactChild | React.ReactElement;
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
        <span className="text-l mx-auto mb-5 block font-montserrat font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100 lg:text-xl">
            {props.children}
        </span>
    );
};

const GetInvolved: NextPage = (): React.ReactElement => (
    <>
        <Head>
            <meta name="description" content={Config.urls.authorGuide.description} />
            <meta name="keywords" content={Config.urls.authorGuide.keywords.join(', ')} />
            <link rel="canonical" href={Config.urls.authorGuide.canonical} />
            <title>{Config.urls.authorGuide.title}</title>
        </Head>

        <Layouts.Standard fixedHeader={false}>
            <PageSection>
                <>
                    <div className="mx-auto block lg:w-9/12 xl:w-10/12 2xl:w-7/12">
                        <h1 className="mb-5 mt-5 block text-center font-montserrat text-3xl font-black !leading-tight tracking-tight text-grey-700 transition-colors duration-500 dark:text-white-50 lg:text-5xl">
                            Get involved with Octopus
                        </h1>
                        <StandardText>
                            <>
                                This page outlines how you can participate directly in the Octopus project and inform
                                platform development. <br /> <br /> We are committed to building Octopus in line with
                                user needs, and so will ensure that the research community is engaged at all stages of
                                the project.
                            </>
                        </StandardText>
                        <Components.PageSubTitle text="Project roadmap" className="mt-2" />
                        <StandardText>
                            <>
                                We launched an initial release of the platform in June 2022. However, this is an
                                iterative project and we are working to add and refine available features and
                                functionality.
                                <br />
                                <br />
                                Our feature roadmap can be viewed here:{' '}
                                <Components.Link
                                    href="https://eu-rm.roadmunk.com/publish/ed007cbc0353ba9ca7ccde0e80139a88e1796842"
                                    openNew={true}
                                    className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                >
                                    https://eu-rm.roadmunk.com/publish/ed007cbc0353ba9ca7ccde0e80139a88e1796842
                                </Components.Link>
                                <br />
                                <br />
                                <span className="italic">
                                    Please note that the roadmap is provisional. Specific features and timescales are
                                    indicative and may be subject to change.
                                </span>
                                <br />
                                <br />
                                If you have any questions, or would like to propose or prioritise a feature, contact us
                                at help@jisc.ac.uk.
                                <Components.PageSubTitle text="User community" className="mt-8" />
                                The Octopus user community is a collaborative space for the users and builders of
                                Octopus. We use it as a forum to share features under development, co-ordinate user
                                testing, and host meetings to discuss project strategy and development plans.
                                <br />
                                <br />
                                This community is open to researchers globally. It may also be of interest to those in
                                relevant roles within the research lifecycle.
                                <br />
                                <br />
                                To get involved, you can{' '}
                                <Components.Link
                                    href="https://forms.office.com/Pages/ResponsePage.aspx?id=TTn5SBSKJ02CpvNfEjYSBdQdk25FM49NmnYND3Z_nExUMFBIRU5LU0FZR1Y2RzVCUUIwQzhUVDc4Wi4u"
                                    openNew={true}
                                    className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                >
                                    request to join our user community Teams site
                                </Components.Link>
                                .
                                <Components.PageSubTitle text="Critical friends panel" className="mt-8" />
                                We have started a critical friends panel comprising research stakeholders willing to
                                feed in to project strategy. This includes representatives from institutions and
                                societies, funders, publishers, and other research systems providers.
                                <br />
                                <br />
                                If you think your organisation would like to participate in Octopus&apos; development in
                                this way, contact us at{' '}
                                <Components.Link
                                    href="mailto:help@jisc.ac.uk"
                                    openNew={true}
                                    className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                >
                                    help@jisc.ac.uk
                                </Components.Link>
                                .
                                <Components.PageSubTitle text="Mailing Lists" className="mt-8" />
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
                    </div>
                </>
            </PageSection>
        </Layouts.Standard>
    </>
);

export default GetInvolved;
