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
    publicationTypes: [{ id: string; icon: React.ReactElement; heading: string; content: string }];
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
        id: 'problem',
        icon: (
            <OutlineIcons.LinkIcon className="mb-2 block h-6 w-6 text-yellow-700 transition-colors duration-500 dark:text-yellow-300" />
        ),
        linkNumber: 1,
        heading: 'Research Problem',
        content: 'a neatly defined scientific problem.'
    },
    {
        id: 'hypothesis',
        icon: (
            <OutlineIcons.LinkIcon className="mb-2 block h-6 w-6 text-yellow-700  transition-colors duration-500 dark:text-yellow-300" />
        ),
        linkNumber: 2,
        heading: 'Hypothesis/Rationale',
        content:
            'an original hypothesis relating to an existing published Problem or the rationale for how you think the Problem could be addressed.'
    },
    {
        id: 'method',
        icon: (
            <OutlineIcons.LinkIcon className="mb-2 block h-6 w-6 text-yellow-700  transition-colors duration-500 dark:text-yellow-300" />
        ),
        linkNumber: 3,
        heading: 'Methods/Protocols',
        content: 'a practical method of testing an existing published Hypothesis.'
    },
    {
        id: 'data',
        icon: (
            <OutlineIcons.LinkIcon className="mb-2 block h-6 w-6 text-yellow-700  transition-colors duration-500 dark:text-yellow-300" />
        ),
        linkNumber: 4,
        heading: 'Data/Results',
        content:
            'raw data or summarised results collected according to an existing published Method (can be linked to a data repository).'
    },
    {
        id: 'analysis',
        icon: (
            <OutlineIcons.LinkIcon className="mb-2 block h-6 w-6 text-yellow-700  transition-colors duration-500 dark:text-yellow-300" />
        ),
        linkNumber: 5,
        heading: 'Analysis',
        content: 'a statistical or thematic analysis of existing published Data or Results.'
    },
    {
        id: 'interpretation',
        icon: (
            <OutlineIcons.LinkIcon className="mb-2 block h-6 w-6 text-yellow-700 transition-colors duration-500 dark:text-yellow-300" />
        ),
        linkNumber: 6,
        heading: 'Interpretation',
        content: 'a discussion around an existing published Analysis.'
    },
    {
        id: 'implementation',
        icon: (
            <OutlineIcons.LinkIcon className="mb-2 block h-6 w-6 text-yellow-700 transition-colors duration-500 dark:text-yellow-300" />
        ),
        linkNumber: 7,
        heading: 'Real-world Implementation',
        content: 'real world applications arising from an existing published Interpretation.'
    },
    {
        id: 'peer_review',
        icon: (
            <OutlineIcons.LinkIcon className="mb-2 block h-6 w-6 text-yellow-700 transition-colors duration-500 dark:text-yellow-300" />
        ),
        linkNumber: 8,
        heading: 'Peer Review',
        content: 'a considered, detailed review of any of the above kinds of publication.'
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
                id="learn_about_octopus"
                className=" bg-teal-50 dark:bg-grey-800"
                waveFillTop="fill-teal-100 dark:fill-grey-500 transition-colors duration-500"
                waveFillMiddle="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                waveFillBottom="fill-teal-300 dark:fill-grey-900 transition-colors duration-500"
            >
                {/* Learn about Octopus section */}
                <div className="container mx-2 px-8 pt-8 pb-8 lg:mx-auto lg:pt-24">
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

                <Assets.Logo className="mx-auto mt-24 mb-10 dark:fill-teal-500 lg:my-24" height={70} width={70} />

                {/* What makes Octopus different? section */}
                <div className="container mx-auto px-8">
                    <h2 className="mx-auto mb-12 block text-center font-montserrat text-2xl font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100 lg:mb-24 lg:text-3xl">
                        What makes Octopus different?
                    </h2>

                    <div className="container mx-auto mb-20 grid grid-cols-1 gap-10 lg:w-9/12 lg:grid-cols-12 lg:gap-8 xl:w-10/12">
                        {publicationTypes.map((publicationType) => (
                            <div
                                className="col-span-1 h-48 rounded-lg border-2 border-white p-4 shadow dark:border-grey-500 lg:col-span-6 lg:h-60 2xl:col-span-3"
                                key={publicationType.id}
                            >
                                <div className="mb-2 flex gap-1">
                                    {publicationType.icon}
                                    <span className="text-lg font-semibold text-yellow-700 transition-colors duration-500 dark:text-yellow-300">
                                        {publicationType.linkNumber}
                                    </span>
                                </div>
                                <h3 className="mb-2 block font-montserrat text-lg font-semibold text-grey-900  transition-colors duration-500 dark:text-white">
                                    {publicationType.heading}
                                </h3>
                                <p className="mb-10 block leading-6 tracking-wide  transition-colors duration-500 dark:text-grey-200">
                                    {parse(publicationType.content)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="container mx-auto px-8 lg:w-10/12">
                    <h4 className="mb-10 text-center font-montserrat text-xl font-semibold leading-relaxed text-grey-700 transition-colors duration-500 dark:text-white lg:mb-4">
                        Smaller units of publication encourage faster sharing, easier publication writing, and smaller
                        author groups.
                    </h4>
                    <p className="mb-20 text-center text-lg text-grey-700 transition-colors duration-500 dark:text-white lg:mb-12">
                        Allowing researchers to get more meaningful credit for what they&apos;ve done.
                    </p>
                </div>
            </Components.Section>

            <Components.SectionTwo
                id="principles_of_octopus"
                className="bg-teal-300 dark:bg-grey-900"
                waveFillTop="fill-teal-400 dark:fill-grey-600 transition-colors duration-500"
                waveFillMiddle="fill-teal-200 dark:fill-grey-700 transition-colors duration-500"
                waveFillBottom="fill-teal-100 dark:fill-grey-800 transition-colors duration-500"
            >
                {/* Principles of Octopus section */}
                <div className="container mx-auto mb-10 px-8 pt-32 pb-10 text-grey-900 dark:text-white lg:mb-2 lg:w-10/12">
                    <h2 className="mx-auto mb-12 block font-montserrat text-3xl font-bold lg:col-span-2">
                        Principles of Octopus
                    </h2>

                    <div className="mx-auto mb-24 block px-2 text-xl lg:mb-12 lg:px-0 lg:text-2xl xl:mb-20">
                        <ul>
                            <li className="mb-14 flex min-h-[3rem] items-start gap-4 lg:mb-12">
                                <OutlineIcons.LightBulbIcon className="mt-1 w-10 min-w-[2rem] basis-7 text-black transition-colors duration-500 dark:text-white" />
                                <span className="pt-1 font-montserrat font-medium">
                                    Knowledge should not be locked behind paywalls.
                                </span>
                            </li>
                            <li className="h-30 mb-14 flex min-h-[3rem] items-start gap-4 lg:mb-12">
                                <OutlineIcons.LightBulbIcon className="mt-1 w-10 min-w-[2rem] basis-7 text-black transition-colors duration-500 dark:text-white" />
                                <span className="pt-1 font-montserrat font-medium">
                                    New ideas and findings should be shared as quickly as possible.
                                </span>
                            </li>
                            <li className="h-30 mb-8 flex min-h-[3rem] items-start gap-4 lg:mb-12">
                                <OutlineIcons.LightBulbIcon className="mt-1 w-10 min-w-[2rem] basis-7 text-black transition-colors duration-500 dark:text-white" />
                                <span className="pt-1 font-montserrat font-medium">
                                    Work should be accessible for people to share and read, regardless of the languages
                                    they speak.
                                </span>
                            </li>
                            <li className="h-30 flex min-h-[3rem] items-start gap-4">
                                <OutlineIcons.LightBulbIcon className="mt-1 w-10 min-w-[2rem] basis-7 text-black transition-colors duration-500 dark:text-white" />
                                <span className="pt-1 font-montserrat font-medium">
                                    Work should be judged on its merits, not on how good a &apos;story&apos; researchers
                                    can write about it.
                                </span>
                            </li>
                        </ul>
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
                className="bg-teal-100 transition-colors duration-500 dark:bg-grey-800"
                waveFillTop="fill-teal-500 dark:fill-grey-600 transition-colors duration-500"
                waveFillMiddle="fill-teal-600 dark:fill-grey-700 transition-colors duration-500"
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
                        <li className="mb-20 grid min-h-[8rem] grid-cols-1 gap-4 font-montserrat text-base font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-white lg:mb-10 lg:grid-cols-12 lg:items-center lg:pl-10">
                            <OutlineIcons.StarIcon className="col-span-1 mt-1 block h-12 w-12 fill-yellow-300 text-grey-900 transition-colors duration-500 dark:fill-yellow-500 dark:text-white lg:mr-4" />
                            <span className="col-span-1 lg:col-span-11">
                                Every publication you write (including reviews) can be rated by others. Your activity,
                                including publications, reviews and ratings, will appear on your individual author page
                                for everyone to see. Publishing promptly and well, and contributing to the community
                                through constructive reviewing, is therefore rewarded.
                            </span>
                        </li>
                        <li className="mb-8 grid min-h-[8rem] grid-cols-1 items-center gap-4 font-montserrat text-base font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-white lg:grid-cols-12 lg:pl-10">
                            <OutlineIcons.FlagIcon className="col-span-1 mt-1 block h-12 w-12 fill-peach-400 text-grey-900 transition-colors duration-500 dark:text-white lg:mr-4" />
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
