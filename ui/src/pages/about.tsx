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

const faqContents = [
    {
        id: 'why_octopus',
        heading: 'Why would I want to publish in Octopus?',
        content:
            'Octopus is designed to replace journals and papers as the primary research record. The traditional system is not only slow and expensive, but the concept of "papers" is not a good way of disseminating scientific work in the 21st century. By forcing people to share their work only when they get to the end of what can be a very long research process, it slows down the spread of scientific knowledge, and encourages "questionable research practices" in order for researchers to produce seemingly easy, clear narratives that will get their work widely read. Good science isn\'t necessarily a good story. Good science can be the careful collection of a small amount of data, or careful analysis of data collected by someone else, or a good hypothesis (regardless of whether data later supports it or not). Publishing in Octopus is free, fast, and meritocratic. Why hold on to a hypothesis? Publish it now and establish priority – once it"s out in Octopus it"s yours. Why hold onto your data? Publish that now and regardless of what analyses are done by you or others later, the credit for that data is yours. Just like work put on preprint servers, publishing in Octopus doesn\'t stop you publishing an old-fashioned paper later.'
    },
    {
        id: 'how_do_i_publish',
        heading: 'How do I publish?',
        content:
            'Octopus accepts 8 types of publication — all must be linked to another publication somewhere in Octopus. The top of any "chain" is a publication that is defining a scientific Problem. Below that you can publish a Hypothesis (theoretical rationale), below that a Method/Protocol, below that Data/Results, below that Analysis, below that Discussion and below that Applications or translations in the real world. Reviews can be published attached to any of those 7 other types of publication. To publish, click on the icon and follow the steps to upload your manuscript or use the online editor.'
    },
    {
        id: 'copyright',
        heading: 'What about copyright?',
        content:
            'When Octopus allows you to select a Creative Commons copyright label. This will ensure that you can retain your intellectual property rights as the author, but that others can use your work in the way that you want.'
    },
    {
        id: 'rating_system',
        heading: 'What is the rating system?',
        content:
            'Every publication in Octopus can be rated by logged-in readers (i.e. people with an ORCiD). Each type of publication has 3 pre-defined criteria on which you are asked to rate it. These allow us to define what we as a scientific community consider "good science", and allow authors to get truly meritocratic feedback and reward for their work. Everything you rate will be associated with your username, so it will be obvious if you rate people in a partisan manner.'
    },
    {
        id: 'publish_in_other_journals_too',
        heading: 'Can I publish in both Octopus and a journal?',
        content:
            'Octopus is designed to replace journals as the primary research record, allowing journals to concentrate on editorialising primary research and disseminating it in a suitable form to their specific readerships. However, in the medium term, many people will want to continue writing papers and recording work first in Octopus should be no barrier to that. Journal policies differ in how they treat material that has been previously published, such as on a preprint server. We recommend that you check whether your intended journal objects before publishing in Octopus.'
    },
    {
        id: 'steal_ideas',
        heading: "Won't people steal my ideas/data if I publish it?",
        content:
            'Once you\'ve published something, it can"t be stolen - it\'s yours. Publishing to Octopus quickly can establish your priority. If your hypothesis is later supported by data, it doesn"t matter whether that data is collected by you or someone else or by many people: it"s you that published the hypothesis and you that gets the credit for that. Similarly, if you have published the data, that"s a publication already under your belt. You can also publish an analysis of that data - and so can other people.'
    },
    {
        id: 'doi',
        heading: 'Does each publication get a DOI?',
        content:
            'We are working to implement DOIs for each publication in Octopus, just like for any other kind of publication. At the moment, for beta testing, we are using our own unique IDs.'
    },
    {
        id: 'when_will_octopus_launch',
        heading: 'If this is only a beta version, when will Octopus launch?',
        content:
            'This is our first major iteration of Octopus, and we are collating feedback whilst we add in the rest of the features we want for launch. We hope to launch fully in Spring 2022. If you want to help, please email alex.freeman@maths.cam.ac.uk!'
    },
    {
        id: 'why_write_a_public_review',
        heading: 'Why would I write a public review?',
        content:
            'Reviewing and rating is critical to good science. Open peer review, where readers can read the reviews and opinions of others is important as it allows people to learn from the views of those with different experience and knowledge. In Octopus, a review is treated as an equal type of publication to any other, so every review you write will itself appear attached to your individual publication list and will be rated by others. Treat it as carefully as any other piece of work you publish - and enjoy the credit you will get as a result. Some people are concerned about writing open critiques of others" work. We believe that no one writing a genuine, well-argued critique of another"s work is likely to face any backlash, but are considering implementing a system whereby ALL publications in Octopus remain anonymous for their first few months, allowing double-blind reviewing.'
    },
    {
        id: 'formatting_publications',
        heading: 'How do I format my publications?',
        content:
            'Because each publication in Octopus is smaller than an old-fashioned paper, you will no longer need to spend time writing an Introduction etc for each publication. What you will now publish as a Problem will be roughly the equivalent to a traditional paper"s introduction. A Hypothesis directly following that will therefore no longer need to include all the information in that Problem, though may refer to other publications that support the scientific basis for the hypothesis. Similarly, publishing Results/Data will no longer require you to write out the Method, merely link to the published Method you followed, and add only relevant specific details (such as the dates of data collection, batch numbers of reagents, model numbers of equipment etc). References should no longer all be listed at the end of a publication. Since all publication is now online, direct embedded permanent URLs (eg. DOIs) should be used. Acknowledgements should still be given at the end of a publication. For researchers in biomedical sciences, the EQUATOR guidelines on reporting should still be followed. You can format your own publications in the online editor within Octopus to be sure that you get it to look exactly as you want. No more enforced styles, limited words or figures/tables. And no more time/money wasted proof-reading and sending comments back to Editors.'
    },
    {
        id: 'how_can_i_retract',
        heading: 'Someone has pointed out a really important issue in a review - can I retract?',
        content:
            'No need for retraction for an innocent oversight. You can reversion your publication. The old version will still exist on file, but the new one will replace it. If a reviewer made such an important point, do consider offering them co-authorship, but at the minimum, add an acknowledgement.'
    },
    {
        id: 'publication_should_be_retracted',
        heading: 'I think a publication should be retracted!',
        content:
            'If you suspect plagiarism, copyright issues, ethical or scientific misconduct then you will can click to use the Red Flag system to raise your concerns. This will email the authors and you will enter a "dispute resolution" centre. The publication will immediately be flagged so that it is clear to others that an issue has been raised. If the dispute is not quickly resolved, the issue will be escalated to the authors\' institutional Research Integrity Office, or their national office.'
    }
];
// End of content.

const About: NextPage<Props> = (props): JSX.Element => {
    const [open, setOpen] = React.useState(false);

    return (
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
                            <li className="mb-8 flex min-h-[3rem] items-start gap-4 font-montserrat text-xl leading-relaxed text-grey-700 transition-colors duration-500 dark:text-white lg:pl-6 lg:text-lg">
                                <OutlineIcons.EyeIcon className="mr-4 block w-20 pt-2 text-grey-500 transition-colors duration-500 dark:text-white lg:h-8 lg:w-8 lg:basis-7" />
                                <span>
                                    Easy for institutions and funders to see exactly what you&apos;ve done and how it
                                    has been regarded by others.
                                </span>
                            </li>
                            <li className="mb-8 flex min-h-[3rem] items-start gap-4 font-montserrat text-xl leading-relaxed text-grey-700 transition-colors duration-500 dark:text-white lg:pl-6 lg:text-lg">
                                <OutlineIcons.SparklesIcon className="mr-4 block w-20 pt-2 text-grey-500 transition-colors duration-500 dark:text-white lg:h-8 lg:w-8" />
                                <span>
                                    Designed to recognise and reward good practice and serves the needs of both
                                    researchers and the global research endeavour itself.
                                </span>
                            </li>
                            <li className="mb-8 flex min-h-[3rem] items-start gap-4 font-montserrat text-xl leading-relaxed text-grey-700 transition-colors duration-500 dark:text-white lg:pl-6 lg:text-lg">
                                <OutlineIcons.UserCircleIcon className="mr-4 block w-20 pt-2 text-grey-500 transition-colors duration-500 dark:text-white lg:h-8 lg:w-8" />
                                <span>
                                    Free for researchers to publish their work, free for anyone to read and embeds the
                                    principles of openness and transparency throughout.
                                </span>
                            </li>
                            <li className="mb-20 flex min-h-[3rem] items-start gap-4 font-montserrat text-xl leading-relaxed text-grey-700 transition-colors duration-500 dark:text-white lg:pl-6 lg:text-lg">
                                <OutlineIcons.ShareIcon className="mr-4 block w-20 pt-2 text-grey-500 transition-colors duration-500 dark:text-white lg:h-8 lg:w-8" />
                                <span>
                                    Work can be shared in full detail with no &apos;spin&apos;, encouraging a new
                                    culture of collaboration and constructive critique.
                                </span>
                            </li>
                        </ul>
                    </div>

                    <Assets.Logo className="my-24 mx-auto dark:fill-teal-500" height={70} width={70} />

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
                            Smaller units of publication encourage faster sharing, easier publication writing, and
                            smaller author groups.
                        </h4>
                        <p className="mb-20 text-center text-lg text-grey-700 transition-colors duration-500 dark:text-white lg:mb-12">
                            Allowing researchers to get more meaningful credit for what they&apos;ve done.
                        </p>
                    </div>
                </Components.Section>

                <Components.SectionTwo
                    id="principles_of_octopus"
                    className="bg-teal-300 dark:bg-grey-900"
                    waveFillTop="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                    waveFillMiddle="fill-teal-100 dark:fill-grey-700 transition-colors duration-500"
                    waveFillBottom="fill-teal-50 dark:fill-grey-800 transition-colors duration-500"
                >
                    {/* Principles of Octopus section */}
                    <div className="container mx-auto mb-10 px-8 pt-32 pb-10 text-grey-900 dark:text-white lg:mb-2 lg:w-10/12">
                        <h2 className="mx-auto mb-12 block font-montserrat text-3xl font-bold lg:col-span-2">
                            Principles of Octopus
                        </h2>

                        <div className="mx-auto block px-2 text-xl lg:px-0 lg:text-2xl xl:mb-20">
                            <ul>
                                <li className="mb-14 flex min-h-[3rem] items-start gap-4 lg:mb-12">
                                    <OutlineIcons.LightBulbIcon className="mt-1 w-10 min-w-[2rem] basis-7 text-white transition-colors duration-500" />
                                    <span className="pt-1 font-montserrat font-medium">
                                        Knowledge should not be locked behind paywalls.
                                    </span>
                                </li>
                                <li className="h-30 mb-14 flex min-h-[3rem] items-start gap-4 lg:mb-12">
                                    <OutlineIcons.LightBulbIcon className="mt-1 w-10 min-w-[2rem] basis-7 text-white transition-colors duration-500" />
                                    <span className="pt-1 font-montserrat font-medium">
                                        New ideas and findings should be shared as quickly as possible.
                                    </span>
                                </li>
                                <li className="h-30 mb-8 flex min-h-[3rem] items-start gap-4 lg:mb-12">
                                    <OutlineIcons.LightBulbIcon className="mt-1 w-10 min-w-[2rem] basis-7 text-white transition-colors duration-500" />
                                    <span className="pt-1 font-montserrat font-medium">
                                        Work should be accessible for people to share and read, regardless of the
                                        languages they speak.
                                    </span>
                                </li>
                                <li className="h-30 mb-14 flex min-h-[3rem] items-start gap-4 lg:mb-12">
                                    <OutlineIcons.LightBulbIcon className="mt-1 w-10 min-w-[2rem] basis-7 text-white transition-colors duration-500" />
                                    <span className="pt-1 font-montserrat font-medium">
                                        Work should be judged on its merits, not on how good a &apos;story&apos;
                                        researchers can write about it.
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
                    className="bg-teal-50 transition-colors duration-500 dark:bg-grey-800"
                    waveFillTop="fill-teal-600 dark:fill-grey-600 transition-colors duration-500"
                    waveFillMiddle="fill-teal-500 dark:fill-grey-700 transition-colors duration-500"
                    waveFillBottom="fill-teal-400 dark:fill-grey-900 transition-colors duration-500"
                >
                    {/* How do I use Octopus? section */}
                    <div className="container mx-auto px-8 pt-20">
                        <h2 className="mx-auto mb-16 block w-fit font-montserrat text-3xl font-bold text-grey-900 transition-colors duration-500 dark:text-white">
                            How do I use Octopus?
                        </h2>

                        <div className="mx-auto mb-24 grid grid-cols-1 gap-8 lg:mb-20 lg:w-7/12 lg:grid-cols-2">
                            <Components.Paper>
                                <OutlineIcons.DesktopComputerIcon className="mb-8 h-10 w-10 text-teal-500" />
                                <h3 className="mb-6 block font-montserrat text-lg font-bold text-grey-800 transition-colors duration-500 dark:text-white">
                                    To read publications
                                </h3>
                                <p className="mb-8 block font-normal text-grey-800 transition-colors duration-500 dark:text-grey-50">
                                    Anyone can read any Octopus publication, you don&apos;t need to log in.
                                </p>
                                <Components.ExtendedLink
                                    href={Config.urls.browsePublications.path}
                                    title="Browse publications"
                                />
                            </Components.Paper>

                            <Components.Paper>
                                <OutlineIcons.PencilIcon className="mb-8 h-10 w-10 text-teal-500" />
                                <h3 className="mb-6 block font-montserrat text-lg font-bold text-grey-800 transition-colors duration-500 dark:text-white">
                                    To write publications
                                </h3>
                                <p className="mb-8 block font-normal text-grey-800 transition-colors duration-500 dark:text-grey-50">
                                    Log in via your ORCiD account in order to write and review publications.
                                </p>
                                <Components.ExtendedLink
                                    href={Config.urls.createPublication.path}
                                    title="Publish your work"
                                />
                            </Components.Paper>
                        </div>

                        <ul className="mx-auto mb-20 lg:mb-0 lg:w-9/12">
                            <li className="mb-20 grid min-h-[8rem] grid-cols-1 items-center gap-4 font-montserrat text-xl font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-white lg:mb-10 lg:grid-cols-12 lg:pl-10 lg:text-base">
                                <OutlineIcons.StarIcon className="col-span-1 mx-auto mt-1 block h-12 w-12 fill-yellow-300 text-grey-900 transition-colors duration-500 dark:fill-yellow-500 dark:text-white lg:mr-4" />
                                <span className="col-span-1 lg:col-span-11">
                                    Every publication you write (including reviews) can be rated by others. Your
                                    activity, including publications, reviews and ratings, will appear on your
                                    individual author page for everyone to see. Publishing promptly and well, and
                                    contributing to the community through constructive reviewing, is therefore rewarded.
                                </span>
                            </li>
                            <li className="mb-8 grid min-h-[8rem] grid-cols-1 items-center gap-4 font-montserrat text-xl font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-white lg:grid-cols-12 lg:pl-10 lg:text-base">
                                <OutlineIcons.FlagIcon className="col-span-1 mx-auto mt-1 block h-12 w-12 fill-peach-400 text-grey-900 transition-colors duration-500 dark:text-white lg:mr-4" />
                                <span className="col-span-1 lg:col-span-11">
                                    To ensure academic integrity concerns, any publication can be &apos;red
                                    flagged&apos; by a logged-in user. This red flag will be visible on the publication
                                    page and will alert the authors to allow them to resolve any issues. Once the issue
                                    is resolved, the red flag can be removed by the initiating user.
                                </span>
                            </li>
                        </ul>
                    </div>
                </Components.Section>

                <Components.SectionTwo
                    className="bg-teal-400 transition-colors duration-500  dark:bg-grey-900"
                    waveFillTop="fill-teal-500 dark:fill-grey-600 transition-colors duration-500"
                    waveFillMiddle="fill-teal-600 dark:fill-grey-700 transition-colors duration-500"
                    waveFillBottom="fill-teal-700 dark:fill-grey-800 transition-colors duration-500"
                >
                    {/* Frequently asked questions section */}
                    <div className="container mx-auto flex flex-col gap-6 px-8 py-16 lg:w-8/12">
                        <h2 className="mb-6 block font-montserrat text-xl font-bold text-grey-900 dark:text-teal-300 md:text-2xl lg:col-span-2 xl:mb-8">
                            Frequently asked questions
                        </h2>

                        {faqContents?.map((faqContent) => (
                            <Components.Accordion
                                key={faqContent.id}
                                heading={faqContent.heading}
                                content={faqContent.content}
                            />
                        ))}
                    </div>
                </Components.SectionTwo>
            </Layouts.Standard>
        </>
    );
};

export default About;
