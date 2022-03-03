import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import parse from 'html-react-parser';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Assets from '@assets';

type Content = {
    id: string;
    content: string;
};

type Props = {
    heroContents: [{ id: string; heading: string; content: string }];
    publicationTypes: [{ id: string; heading: string; content: string; margin?: string }];
};

// Content for sections stored here.
const heroContents = [
    {
        id: 'publish_freely',
        heading: 'Free and quick to publish',
        content:
            'Octopus is designed to help researchers get their work published quickly, easily and freely. Break away from the tyranny of ‘papers’ and publish your work faster! '
    },
    {
        id: 'establish_priority',
        heading: 'Establish your priority',
        content:
            'No need to worry about being &apos;scooped&apos; - once you’ve published an idea, or a protocol in Octopus you have established your priority. That work now has your name and date on it for everyone to see. '
    },
    {
        id: 'relevant_work',
        heading: 'Find relevant work',
        content:
            'All publications in Octopus are linked, forming branching chains. If you subscribe to a particular research problem you can easily see all work linked to it.'
    },
    {
        id: 'meritocracy',
        heading: 'Get the credit you deserve',
        content:
            'All your work in Octopus, including reviews that you write, are displayed on your personal page for others to see, along with ratings that others have given them.'
    }
];

const publicationTypes = [
    {
        id: 'PROBLEM',
        heading: 'Research Problem',
        content: 'a neatly defined scientific problem.',
        margin: 'pl-7 lg:pl-5'
    },
    {
        id: 'HYPOTHESIS',
        heading: 'Hypothesis/Rationale',
        content:
            'an original hypothesis relating to an existing published Problem or the rationale for how you think the Problem could be addressed.',
        margin: 'pl-2 lg:pl-1'
    },
    {
        id: 'PROTOCOL',
        heading: 'Methods/Protocols',
        content: 'a practical method of testing an existing published Hypothesis.',
        margin: 'pl-4 lg:pl-5'
    },
    {
        id: 'DATA',
        heading: 'Data/Results',
        content:
            'raw data or summarised results collected according to an existing published Method (can be linked to a data repository).',
        margin: 'pl-12 lg:pl-14'
    },
    {
        id: 'ANALYSIS',
        heading: 'Analysis',
        content: 'a statistical or thematic analysis of existing published Data or Results.',
        margin: 'ml-1 lg:ml-0 pl-16'
    },
    {
        id: 'INTERPRETATION',
        heading: 'Interpretation',
        content: 'a discussion around an existing published Analysis.',
        margin: 'pl-14 lg:pl-12'
    },
    {
        id: 'REAL_WORLD_APPLICATION',
        heading: 'Real-world Application',
        content: 'real world applications arising from an existing published Interpretation.',
        margin: 'pl-6 lg:pl-4'
    }
];

const principles = [
    {
        id: 'principle-1',
        content: 'Knowledge should not be locked behind paywalls.'
    },
    {
        id: 'principle-2',
        content: 'New ideas and findings should be shared as quickly as possible.'
    },
    {
        id: 'principle-3',
        content: 'Work should be accessible for people to share and read, regardless of the languages they speak.'
    },
    {
        id: 'principle-4',
        content:
            'Work should be judged on its merits, not on how good a &apos;story&apos; researchers can write about it.'
    }
];
// End of content.

const About: NextPage<Props> = (props): JSX.Element => (
    <>
        <Head>
            <meta name="description" content={Config.urls.about.description} />
            <meta name="keywords" content={Config.urls.about.keywords} />
            <link rel="canonical" href={`${Config.urls.about.canonical}`} />
            <title>{Config.urls.about.title}</title>
        </Head>

        <Layouts.Standard fixedHeader={false}>
            <Components.Section
                id="content"
                className=" bg-teal-50 dark:bg-grey-800"
                waveFillTop="fill-teal-100 dark:fill-grey-500 transition-colors duration-500"
                waveFillMiddle="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                waveFillBottom="fill-teal-300 dark:fill-grey-900 transition-colors duration-500"
            >
                {/* Learn about Octopus section */}
                <div className="container px-8 pt-8 pb-8 lg:mx-auto lg:pt-24">
                    <h1 className="mb-10 block text-center font-montserrat text-3xl font-black !leading-tight tracking-tight text-grey-700 transition-colors duration-500 dark:text-white lg:text-5xl ">
                        Learn about Octopus.
                    </h1>
                    <h2 className="mx-auto mb-20 block text-center font-montserrat text-xl font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100 lg:mb-28 lg:text-2xl">
                        A new way to publish your scientific work that is fast, free and fair.
                    </h2>

                    <div className="mb-10 grid grid-cols-1 gap-10 md:mb-16 lg:mx-auto lg:mb-28 lg:grid-cols-12 ">
                        {heroContents.map((heroContent) => (
                            <div className="col-span-1 lg:col-span-6 xl:col-span-3" key={heroContent.id}>
                                <h3 className="mb-2 block font-montserrat text-lg font-semibold text-grey-900 underline decoration-teal-300 decoration-2 transition-colors duration-500 dark:text-white">
                                    {heroContent.heading}
                                </h3>
                                <p className="block text-sm leading-6 tracking-wide text-grey-700 transition-colors duration-500 dark:text-grey-200 lg:text-base">
                                    {parse(heroContent.content)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="container mx-auto mb-10 gap-6 px-8 lg:mb-16">
                    <Components.HTMLVideo
                        srcWebM="/video/webm/a_quick_introduction_to_octopus.webm"
                        srcMp4="/video/mp4/a_quick_introduction_to_octopus.mp4"
                        title="A quick introduction to Octopus: the new primary research record for science"
                        showCaption={false}
                        controls={true}
                        poster="/images/jpg/poster.jpg"
                        width={1024}
                        className="mx-auto !w-fit bg-transparent"
                    />
                </div>

                <div className="container mx-auto px-8">
                    <ul className="mx-auto lg:w-8/12">
                        <li className="mb-8 flex min-h-[3rem] items-start gap-4 font-montserrat text-lg leading-relaxed text-grey-700 transition-colors duration-500 dark:text-white lg:pl-6">
                            <OutlineIcons.EyeIcon className="mr-4 block w-20 pt-2 text-grey-500 transition-colors duration-500 dark:text-white lg:h-8 lg:w-8 lg:basis-7" />
                            <span>
                                Easy for institutions and funders to see exactly what you&apos;ve done and how it has
                                been regarded by others.
                            </span>
                        </li>
                        <li className="mb-8 flex min-h-[3rem] items-start gap-4 font-montserrat text-lg leading-relaxed text-grey-700 transition-colors duration-500 dark:text-white lg:pl-6">
                            <OutlineIcons.SparklesIcon className="mr-4 block w-20 pt-2 text-grey-500 transition-colors duration-500 dark:text-white lg:h-8 lg:w-8" />
                            <span>
                                Designed to recognise and reward good practice and serves the needs of both researchers
                                and the global research endeavour itself.
                            </span>
                        </li>
                        <li className="mb-8 flex min-h-[3rem] items-start gap-4 font-montserrat text-lg leading-relaxed text-grey-700 transition-colors duration-500 dark:text-white lg:pl-6">
                            <OutlineIcons.UserCircleIcon className="mr-4 block w-20 pt-2 text-grey-500 transition-colors duration-500 dark:text-white lg:h-8 lg:w-8" />
                            <span>
                                Free for researchers to publish their work, free for anyone to read and embeds the
                                principles of openness and transparency throughout.
                            </span>
                        </li>
                        <li className="mb-20 flex min-h-[3rem] items-start gap-4 font-montserrat text-lg leading-relaxed text-grey-700 transition-colors duration-500 dark:text-white lg:pl-6">
                            <OutlineIcons.ShareIcon className="mr-4 block w-20 pt-2 text-grey-500 transition-colors duration-500 dark:text-white lg:h-8 lg:w-8" />
                            <span>
                                Work can be shared in full detail with no &apos;spin&apos;, encouraging a new culture of
                                collaboration and constructive critique.
                            </span>
                        </li>
                    </ul>
                </div>

                <Assets.Logo className="mx-auto mt-24 mb-14 dark:fill-teal-500 lg:my-24" height={70} width={70} />

                {/* What makes Octopus different? section */}
                <div className="container lg:mx-auto lg:px-8">
                    <h2 className="mx-auto mb-16 block px-8 text-center font-montserrat text-3xl font-bold text-grey-900 transition-colors duration-500 dark:text-grey-100 lg:px-0">
                        What makes Octopus different?
                    </h2>
                    <div className="mx-auto mb-24 flex lg:w-6/12 2xl:w-5/12">
                        <div className="-ml-24 lg:ml-0">
                            <Assets.LinkingVerticalWave />
                        </div>
                        <div className="container -ml-24 grid grid-cols-1 gap-1">
                            {publicationTypes.map((publicationType) => (
                                <div
                                    id={publicationType.id}
                                    className={`mt-8 h-[90px] lg:mt-14 ${publicationType.margin}`}
                                    key={publicationType.id}
                                >
                                    <div className="flex items-start gap-6 font-montserrat text-sm font-semibold uppercase tracking-wide text-grey-900 transition-colors duration-500 dark:text-white lg:text-xl">
                                        <OutlineIcons.LinkIcon className="h-7 w-7 rounded-full bg-grey-900 p-1 text-white shadow transition-colors duration-500 dark:bg-teal-50 dark:text-black lg:mb-1" />
                                        {parse(publicationType.heading)}
                                    </div>
                                    <div className="block pl-12 text-sm leading-6 tracking-wide text-grey-700 transition-colors duration-500 dark:text-grey-200 lg:w-[400px]  lg:pl-14 lg:text-sm">
                                        {parse(publicationType.content)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="container mx-auto mb-28 px-8 lg:w-10/12">
                        <h4 className="mb-6 text-center font-montserrat text-lg font-semibold leading-relaxed text-grey-700 transition-colors duration-500 dark:text-white lg:mb-4 lg:text-xl">
                            Smaller units of publication encourage faster sharing, easier publication writing, and
                            smaller author groups.
                        </h4>
                        <p className="mb-20 text-center text-base text-grey-700 transition-colors duration-500 dark:text-white lg:mb-12 lg:text-lg">
                            Allowing researchers to get more meaningful credit for what they&apos;ve done.
                        </p>
                    </div>
                    <div id="PEER_REVIEW" className="container mx-auto mb-20 lg:mb-6">
                        <div className="mx-auto mb-2 flex flex-col items-center gap-1 font-montserrat text-base font-semibold uppercase tracking-wide text-grey-900 transition-colors duration-500 dark:text-white lg:text-xl">
                            <OutlineIcons.LinkIcon className="mb-2 h-6 w-6 rounded-full bg-teal-500 p-1 text-white shadow transition-colors duration-500" />
                            Peer Review
                        </div>
                        <div className="mx-auto block w-10/12 text-center text-sm leading-6 tracking-wide text-grey-700 transition-colors duration-500 dark:text-grey-200 lg:w-3/12 lg:text-base">
                            A considered, detailed review of any of the above kinds of publication.
                        </div>
                    </div>
                </div>
            </Components.Section>

            <Components.SectionTwo
                id="principles_of_octopus"
                className="bg-teal-300 dark:bg-grey-900"
                waveFillTop="fill-teal-400 dark:fill-grey-700 transition-colors duration-500"
                waveFillMiddle="fill-teal-200 dark:fill-grey-800 transition-colors duration-500"
                waveFillBottom="fill-teal-100 dark:fill-grey-900 transition-colors duration-500"
            >
                {/* Principles of Octopus section */}
                <div className="container mx-auto mb-10 px-8 pt-32 pb-10 text-grey-900 dark:text-white lg:mb-2 lg:w-10/12">
                    <h2 className="mx-auto mb-12 block font-montserrat text-3xl font-bold lg:col-span-2">
                        Principles of Octopus
                    </h2>

                    <div className="mx-auto mb-24 block px-2 lg:mb-12 lg:px-0 xl:mb-20">
                        {principles.map((principle) => (
                            <ul key={principle.id}>
                                <li className="mb-14 flex min-h-[3rem] items-start gap-4 lg:mb-12">
                                    <OutlineIcons.LightBulbIcon className="mt-1 w-10 min-w-[2rem] basis-7 rounded-full bg-teal-100 text-black transition-colors duration-500 " />
                                    <span className="pt-1 font-montserrat text-lg font-medium lg:text-2xl">
                                        {parse(principle.content)}
                                    </span>
                                </li>
                            </ul>
                        ))}
                    </div>

                    <p className="mb-2 font-montserrat text-lg font-medium leading-relaxed text-grey-900 transition-colors duration-500 dark:text-white">
                        Do you feel like these principles align with your own?
                    </p>
                    <p className="mb-12 font-montserrat leading-relaxed text-grey-900 transition-colors duration-500 dark:text-white">
                        You can help to support Octopus by joining our user community.
                    </p>
                    <Components.Button href="#" title="Join our user community" />
                </div>
            </Components.SectionTwo>

            <Components.Section
                id="using_octopus"
                className="bg-teal-100 transition-colors duration-500 dark:bg-grey-900"
                waveFillTop="fill-teal-500 dark:fill-grey-500 transition-colors duration-500"
                waveFillMiddle="fill-teal-600 dark:fill-grey-600 transition-colors duration-500"
                waveFillBottom="fill-teal-700 dark:fill-grey-800 transition-colors duration-500"
            >
                {/* How do I use Octopus? section */}
                <div className="container mx-auto px-8 pt-20">
                    <h2 className="mx-auto mb-16 block w-fit text-center font-montserrat text-3xl font-bold text-grey-900 transition-colors duration-500 dark:text-white">
                        How do I use Octopus?
                    </h2>

                    <div className="mx-auto mb-24 grid grid-cols-1 gap-24 lg:mb-24 lg:w-7/12">
                        <div className="col-span-1 mx-auto text-center">
                            <OutlineIcons.DesktopComputerIcon className="mx-auto mb-4 h-10 w-10 text-teal-500" />
                            <h3 className="mb-4 block font-montserrat text-lg font-bold text-grey-800 transition-colors duration-500 dark:text-white">
                                To read publications
                            </h3>
                            <p className="mb-8 block font-normal text-grey-800 transition-colors duration-500 dark:text-grey-50">
                                Anyone can read any Octopus publication, you don&apos;t need to log in.
                            </p>
                            <Components.Button href={Config.urls.browsePublications.path} title="Browse publications" />
                        </div>

                        <div className="col-span-1 mx-auto text-center">
                            <OutlineIcons.PencilIcon className="mx-auto mb-4 h-10 w-10 text-teal-500" />
                            <h3 className="mb-4 block font-montserrat text-lg font-bold text-grey-800 transition-colors duration-500 dark:text-white">
                                To write publications
                            </h3>
                            <p className="mb-8 block font-normal text-grey-800 transition-colors duration-500 dark:text-grey-50">
                                Log in via your ORCiD account in order to write and review publications.
                            </p>
                            <Components.Button href={Config.urls.createPublication.path} title="Publish your work" />
                        </div>
                    </div>

                    <ul className="mb-20 lg:mx-auto lg:mb-0 lg:w-9/12">
                        <li className="mb-20 grid min-h-[8rem] grid-cols-1 gap-4 font-montserrat text-base font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100 lg:mb-10 lg:grid-cols-12 lg:items-center lg:pl-10">
                            <OutlineIcons.StarIcon className="col-span-1 mt-1 block h-12 w-12 fill-yellow-200 text-grey-900 transition-colors duration-500 dark:fill-yellow-500 dark:text-white lg:mr-4" />
                            <span className="col-span-1 lg:col-span-11">
                                Every publication you write (including reviews) can be rated by others. Your activity,
                                including publications, reviews and ratings, will appear on your individual author page
                                for everyone to see. Publishing promptly and well, and contributing to the community
                                through constructive reviewing, is therefore rewarded.
                            </span>
                        </li>
                        <li className="mb-8 grid min-h-[8rem] grid-cols-1 items-center gap-4 font-montserrat text-base font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100 lg:grid-cols-12 lg:pl-10">
                            <OutlineIcons.FlagIcon className="col-span-1 mt-1 block h-12 w-12 fill-peach-300 text-grey-900 transition-colors duration-500 dark:text-white lg:mr-4" />
                            <span className="col-span-1 lg:col-span-11">
                                To ensure academic integrity concerns, any publication can be &apos;red flagged&apos; by
                                a logged-in user. This red flag will be visible on the publication page and will alert
                                the authors to allow them to resolve any issues. Once the issue is resolved, the red
                                flag can be removed by the initiating user.
                            </span>
                        </li>
                    </ul>
                </div>

                <Assets.Logo className="mx-auto mt-24 mb-10 dark:fill-teal-500 lg:my-24" height={70} width={70} />

                {/* Need more information section */}
                <div className="container mx-auto mb-10 px-8 pt-10 pb-10 text-center text-grey-900 dark:text-white lg:mb-2 lg:w-10/12">
                    <p className="mb-8 font-montserrat text-xl font-medium leading-relaxed text-grey-900 transition-colors duration-500 dark:text-white">
                        Do you need more information?
                    </p>
                    <Components.Button href={Config.urls.faq.path} title="Go to FAQs" />
                </div>
            </Components.Section>
        </Layouts.Standard>
    </>
);

export default About;
