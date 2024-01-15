import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as Framer from 'framer-motion';

import * as Components from '@/components';
import * as Layouts from '@/layouts';
import * as Config from '@/config';

type CardItemProps = {
    title: string;
    content: string;
    icon?: React.ReactElement;
};

const CardItem: React.FC<CardItemProps> = (props): React.ReactElement => (
    <div className="w-30 mx-3 mt-3 space-y-6 rounded-md bg-white-50 px-6 py-6 shadow-lg transition-colors duration-500 dark:bg-grey-700">
        {props.icon}
        <span className="block font-montserrat text-lg font-bold text-grey-800 transition-colors duration-500 dark:text-white-50">
            {props.title}
        </span>
        <p className="block text-sm font-normal text-grey-800 transition-colors duration-500 dark:text-grey-50">
            {props.content}
        </p>
    </div>
);

type PageSectionProps = {
    children: React.ReactNode;
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

const About: NextPage = (): React.ReactElement => (
    <>
        <Head>
            <title>{Config.urls.about.title}</title>
            <meta name="description" content={Config.urls.about.description} />
            <meta name="keywords" content={Config.urls.about.keywords.join(', ')} />
            <meta name="og:title" content={Config.urls.about.title} />
            <meta name="og:description" content={Config.urls.about.description} />
            <link rel="canonical" href={Config.urls.about.canonical} />
        </Head>

        <Layouts.Standard fixedHeader={false}>
            <PageSection>
                <>
                    <div className="mx-auto block lg:w-9/12 xl:w-10/12 2xl:w-7/12">
                        <h1 className="mb-5 mt-5 block text-center font-montserrat text-3xl font-black !leading-tight tracking-tight text-grey-700 transition-colors duration-500 dark:text-white-50 lg:text-5xl">
                            Learn about Octopus.
                        </h1>
                        <h2 className="text-l mx-auto mb-5 block text-center font-montserrat font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100 lg:text-xl">
                            Octopus is not just another publishing platform, it is designed to be the primary research
                            record, and to create an incentive structure which maintains the highest standards of
                            research and research culture.
                        </h2>
                        <h2 className="text-l mx-auto mb-5 block text-center font-montserrat font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100 lg:text-xl">
                            It sits alongside journals and other dissemination outlets: they can specialise in
                            delivering key findings to their audiences. Octopus, meanwhile, is where researchers can
                            publish everything in full: ideas, hypotheses, full data, analyses, code and reviews of
                            others&apos; work. It acts like a &apos;patent office&apos; to record who has done what and
                            when, and ensure the quality, integrity and accessibility of all primary research, in full.
                        </h2>
                    </div>
                    <div className="mx-auto mb-20 mt-10 flex w-fit space-x-6 ">
                        <Components.Link
                            href={Config.urls.faq.path}
                            className="flex items-center justify-between rounded-lg bg-teal-400 px-8 py-5 text-center outline-0 transition-colors duration-300 hover:bg-teal-300 focus:ring-2 focus:ring-yellow-400 dark:bg-grey-700 dark:text-white-50 dark:hover:bg-grey-600"
                        >
                            <span className="text-center font-montserrat text-sm leading-none tracking-wide">FAQs</span>
                        </Components.Link>
                        <Components.Link
                            href={Config.urls.authorGuide.path}
                            className="flex items-center justify-between rounded-lg bg-teal-400 px-8 py-5 text-center outline-0 transition-colors duration-300 hover:bg-teal-300 focus:ring-2 focus:ring-yellow-400 dark:bg-grey-700 dark:text-white-50 dark:hover:bg-grey-600"
                        >
                            <span className="text-center font-montserrat text-sm leading-none tracking-wide">
                                Author Guide
                            </span>
                        </Components.Link>
                        <Components.Link
                            href={Config.urls.octopusAims.path}
                            className="flex items-center justify-between rounded-lg bg-teal-400 px-6 py-5 text-center outline-0 transition-colors duration-300 hover:bg-teal-300 focus:ring-2 focus:ring-yellow-400 dark:bg-grey-700 dark:text-white-50 dark:hover:bg-grey-600"
                        >
                            <span className="text-center font-montserrat text-sm leading-none tracking-wide">
                                Our aims in detail
                            </span>
                        </Components.Link>
                    </div>
                </>
            </PageSection>
            <PageSection>
                <div className="grid grid-cols-1 gap-2 lg:my-10 lg:grid-cols-2 lg:gap-4 2xl:grid-cols-4">
                    <CardItem
                        title="Free and fast"
                        content="We believe that new ideas and findings should be shared as quickly and accessibly as possible, and that primary research, including data and code should not be locked behind paywalls. On Octopus, researchers can put their work into the research record quickly, easily and in full. Researchers then have no need to worry about ‘being scooped’ as they can establish priority immediately. Others can use or build on the research quickly. Research of all types can be recorded, without barriers or editorial gatekeepers."
                        icon={<OutlineIcons.BoltIcon className="h-8 w-8 text-teal-500" />}
                    />
                    <CardItem
                        title="Emphasis on quality"
                        content="Researchers should be recognised for the quality of their contributions, with work judged on its intrinsic merits not on anything else. The eight publication types on Octopus are designed to remove the incentives that lead to publication bias and questionable research practices because each part of the research process is now treated independently, not on how much it supports a hypothesis or theory. In Octopus, ‘findings’ are no more important than theories, methods, analyses or implementation – each are published independently and stand on their own merits. Octopus is also designed to remove sources of potential bias when assessing work: there are no photos, institutions or first names on publications that might affect reviews."
                        icon={<OutlineIcons.ShieldCheckIcon className="h-8 w-8 text-teal-500" />}
                    />
                    <CardItem
                        title="Fair recognition for researchers"
                        content="The smaller publications on Octopus encourage more meaningful author groups which accurately reflect who contributed directly to each element. This creates a fairer recognition structure for those in specialist roles. All activity on platform is also recorded and stored on a user’s public profile – including publications, peer reviews and red flags – which over time will build a clear picture of their contributions to the collaborative Octopus community."
                        icon={<OutlineIcons.ScaleIcon className="h-8 w-8 text-teal-500" />}
                    />
                    <CardItem
                        title="Find relevant work"
                        content="All publications in Octopus are linked, forming branching chains. You can browse these links from each publication page to discover new content, while authors can identify potential collaborations working on related projects. Institutions and funders can also view all the research recorded by their researchers."
                        icon={<OutlineIcons.MagnifyingGlassIcon className="h-8 w-8 text-teal-500" />}
                    />
                </div>
            </PageSection>

            <PageSection>
                <div className="w-30 col-span-1 my-auto mb-20 h-auto space-y-6 rounded-md bg-white-50 px-6 py-6 shadow-lg transition-colors duration-500 dark:bg-grey-700 sm:mx-auto md:my-auto">
                    <div className="text-center lg:mt-5">
                        <h2 className="mb-6 block font-montserrat text-xl font-bold leading-none text-grey-800 transition-colors duration-500 dark:text-white-50">
                            Do you feel like these principles align with your own?
                        </h2>
                        <p className="mb-6 block font-montserrat text-lg font-medium text-grey-700 transition-colors duration-500 dark:text-grey-50 ">
                            You can help to support Octopus by joining our user community.
                        </p>
                        <Components.Button
                            title="Learn more about getting involved."
                            href={Config.urls.getInvolved.path}
                            endIcon={
                                <OutlineIcons.UsersIcon className="h-4 w-4 text-teal-500 transition-colors duration-500 dark:text-white-50" />
                            }
                        />
                    </div>
                </div>
            </PageSection>
            <PageSection>
                <Components.HTMLVideo
                    width="100%"
                    title="An introduction to Octopus"
                    showCaption
                    controls
                    controlsList="nodownload"
                    srcMp4="https://octopus-promo-video.s3.eu-west-1.amazonaws.com/Jisc+-+Octopus+Animation.mp4"
                    poster="https://octopus-promo-video.s3.eu-west-1.amazonaws.com/octopus-promo-video-poster.jpg"
                />
            </PageSection>
            <PageSection>
                <div className="mx-auto block lg:w-9/12 xl:w-10/12 2xl:w-7/12">
                    <Components.PageSubTitle text="Octopus publication types" className="text-center" />
                    <h2 className="text-l mx-auto mb-5 block text-center font-montserrat font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100 lg:text-xl">
                        Octopus is the place to officially record your research contributions. It is intentionally
                        different from writing an article for a journal, with 8 publication types more closely aligned
                        with the stages of the research process.
                    </h2>
                    <h2 className="text-l mx-auto mb-5 block text-center font-montserrat font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100 lg:text-xl">
                        These smaller units of publication make it quicker and easier to record research in full and aim
                        to encourage smaller, more meaningful author groups which allow all researchers to get fair
                        credit for their work.
                    </h2>
                    <h2 className="text-l mx-auto mb-5 block text-center font-montserrat font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100 lg:text-xl">
                        Visit our{' '}
                        <Components.Link title="FAQs" href={Config.urls.faq.path} className="text-teal-600 underline">
                            FAQs
                        </Components.Link>{' '}
                        for more information on publishing to Octopus.
                    </h2>
                </div>
            </PageSection>
            <Components.VisualPublicationFlow />
            <Framer.motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', delay: 0.5 }}
                className="mt-10 transition-all duration-500 md:mt-0"
            >
                <div className="mx-auto mb-2 flex flex-col items-center gap-1 font-montserrat text-base font-semibold uppercase tracking-wide text-grey-900 transition-colors duration-500 dark:text-white-50 lg:text-xl">
                    <OutlineIcons.UserCircleIcon className="mb-2 h-6 w-6 rounded-full bg-teal-500 p-1 text-white-50 shadow transition-colors duration-500" />
                    Peer Review
                </div>
                <div className="mx-auto block w-10/12 text-center text-sm leading-6 tracking-wide text-grey-700 transition-colors duration-500 dark:text-grey-200 lg:w-5/12 lg:text-base">
                    A considered, detailed peer review of one of the above kinds of publication. Octopus reviews are
                    open and post-publication.
                </div>
            </Framer.motion.div>
            <PageSection>
                <>
                    <Components.PageSubTitle text="Get started with Octopus" className="text-center" />
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
                        <Components.ActionCard
                            title="Publish your work"
                            content="Recording your work on Octopus is different from publishing a paper. There are eight publication types that are aligned with the research process and designed to help researchers of all types share their work and be recognised for it."
                            icon={<OutlineIcons.PencilIcon className="h-8 w-8 text-teal-500" />}
                            link={Config.urls.createPublication.path}
                            linkText="Publish your work"
                        />
                        <Components.ActionCard
                            title="Browse publications"
                            content="Every publication in Octopus is linked to another, forming branching chains of research. You can navigate these chains from every publication page to browse areas of research and discover something new."
                            icon={<OutlineIcons.ComputerDesktopIcon className="h-8 w-8 text-teal-500" />}
                            link={Config.urls.browsePublications.path}
                            linkText="Browse publications"
                        />
                        <Components.ActionCard
                            title="FAQs"
                            content="Review our FAQs to find out more about how the platform works."
                            icon={<OutlineIcons.QuestionMarkCircleIcon className="h-8 w-8 text-teal-500" />}
                            link={Config.urls.faq.path}
                            linkText="See FAQ's"
                        />
                    </div>
                </>
            </PageSection>
        </Layouts.Standard>
    </>
);

export default About;
