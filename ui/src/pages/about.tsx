import { NextPage } from 'next';
import Head from 'next/head';

import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Assets from '@assets';

type Content = {
    id: string;
    content: string;
};

type Props = {
    aboutSections: string[];
    heroContents: string[];
    sectionContents: [{ id: string; heading: string; contents: Content[] }];
};

const About: NextPage<Props> = (props): JSX.Element => {
    const tab = { title: 'test', content: 'test' };
    const heroContents = [
        {
            heading: 'Publish freely',
            content:
                'Upload your publications when they are done. No need to wait around until you have a full scientific paper ready.'
        },
        {
            heading: 'Establish priority',
            content: 'Stake your claim on an idea early, and establish your interests.'
        },
        {
            heading: 'Get quick peer reviews',
            content: 'Scientific ideas and findings should be shared as quickly as possible.'
        },
        {
            heading: 'Meritocracy',
            content:
                'Scientific work should be judged on its merits, and not on how good a "story" it tells: and so should scientific researchers.'
        }
    ];

    const sectionContents = [
        {
            id: 'what_is_octopus',
            heading: 'What is Octopus?',
            contents: [
                {
                    id: 1,
                    content: 'A new way to publish your scientific work that is fast, free and fair.'
                },
                {
                    id: 2,
                    content:
                        'Designed to replace journals and papers as the place to establish priority and record your work in full detail. Octopus is free to use and publishes all kinds of scientific work, whether it is a hypothesis, a method,data, an analysis or peer review.'
                },
                {
                    id: 3,
                    content:
                        'Publication is instant. Peer review happens openly. All work can be reviewed and rated. Your personal page records everything you do and how it is rated by your peers.'
                },
                {
                    id: 4,
                    content:
                        'Octopus encourages meritocracy, collaboration and a fast and effective scientific process.'
                },
                {
                    id: 5,
                    content: 'Created in partnership with the UK Reproducibility Network.'
                }
            ]
        },
        {
            id: 'why_publish_in_octopus',
            heading: 'Why publish in Octopus?',
            contents: [
                {
                    id: 1,
                    content: 'Establish priority on your ideas and your work instantly. You can publish a paper later.'
                },
                {
                    id: 2,
                    content:
                        'Publish work that you cannot publish elsewhere: hypotheses, small data sets, methods, peer reviews. Get credit for it, and let the scientific community benefit.'
                },
                {
                    id: 3,
                    content:
                        "No need to write a whole 'paper'. You only need to write up what is new: Octopus is fast and efficient"
                },
                {
                    id: 4,
                    content:
                        'Everything you do within Octopus - and how it is received by your peers - will appear on your public profile page, for funders, institutions and other researchers to see.'
                }
            ]
        },
        {
            id: 'what_makes_octopus_different',
            heading: 'What makes Octopus different?',
            contents: [
                {
                    id: 1,
                    content: "In Octopus you publish work in units smaller than a 'paper'."
                },
                {
                    id: 2,
                    content:
                        'You can write and share one of eight kinds of publication (though we support custom types for different fields and research types)'
                },
                {
                    id: 3,
                    content: 'Problem -  a neatly defined scientific problem.'
                },
                {
                    id: 4,
                    content:
                        'Hypothesis/Theoretical Rationale - an original hypothesis relating to an existing published Problem or the rationale for how you think the Problem could be addressed'
                },
                {
                    id: 5,
                    content: 'Method/Protocol - a practical method of testing an existing published Hypothesis'
                },
                {
                    id: 6,
                    content:
                        'Data/Results - raw data or summarised results collected according to an existing published Method (can be linked to a data repository)'
                },
                {
                    id: 7,
                    content: 'Analysis - a statistical or thematic analysis of existing published Data or Results'
                },
                {
                    id: 8,
                    content: 'Interpretation - a discussion around an existing published Analysis'
                },
                {
                    id: 9,
                    content:
                        "Translation/Application - 'real world' applications arising from an existing published Interpretation"
                },
                {
                    id: 10,
                    content: 'Review - a considered, detailed review of any of the above kinds of publication'
                },
                {
                    id: 11,
                    content:
                        "Every publication in Octopus must be linked to another existing publication in order to form ordered chains. Only Problems and Reviews can be linked to any of the first publication types – others must be linked only to a type directly above them in the 'chain':"
                },
                {
                    id: 12,
                    content: 'image'
                },
                {
                    id: 13,
                    content:
                        'Anyone can read anything in Octopus. Those logged in with an ORCiD can write and rate publications.'
                },
                {
                    id: 14,
                    content:
                        'Every publication you write (including reviews) can be rated by others, and these will add to your individual page which is available for all individuals, institutions and funding bodies to see. Publishing quickly and well, and good collaborative reviewing is therefore rewarded.'
                },
                {
                    id: 15,
                    content:
                        "Any publication can be 'red flagged' if a reader has serious concerns. This will be visible to other readers and will alert the authors to allow them to resolve any issues."
                }
            ]
        },
        {
            id: 'how_to_publish_in_octopus',
            heading: 'How to publish in Octopus?',
            contents: [
                {
                    id: 1,
                    content: "Use your ORCiD to log in (free and easy to create if you don't have one)."
                },
                {
                    id: 2,
                    content:
                        'Select a publication to link yours to. Every publication in Octopus is linked to another to form chains of work.'
                },
                {
                    id: 3,
                    content:
                        "Upload your work in Word or pdf. Octopus does not publish 'papers': publish your work in smaller units, linked to each other."
                },
                {
                    id: 4,
                    content: 'Select your co-authors.'
                },
                {
                    id: 5,
                    content:
                        "Review your publication and click 'Publish'. An email will be sent to each author. As soon as all authors approve the publication, your publication will become live and open for reviews and ratings."
                },
                {
                    id: 6,
                    content: "It's as simple as that. No formatting. No desk rejection."
                }
            ]
        },
        {
            id: 'peer_review_and_quality_control',
            heading: 'Peer review and quality control',
            contents: [
                {
                    id: 1,
                    content:
                        'Octopus puts authors in control of what they publish. There are no gatekeepers to the research record. But anyone logged into Octopus can rate publications, review them or red flag them if they have serious concerns.'
                },
                {
                    id: 2,
                    content:
                        'Readers can see how many people, and who, have rated a publication and use these as cues of quality. They can also read reviews. This open peer review process allows a much more transparent scrutiny and evaluation of work than the current system.'
                },
                {
                    id: 3,
                    content:
                        'Reviews are treated as an original publication in their own right and can also be rated. This incentivises insightful, collaborative critiquing.'
                }
            ]
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

    return (
        <>
            <Head>
                <meta name="description" content="About Octopus" />
                <meta name="keywords" content="Octopus" />
                <link rel="canonical" href={`${Config.urls.about.canonical}`} />
                <title>{Config.urls.about.title}</title>
            </Head>

            <Layouts.Standard fixedHeader={true}>
                <Components.Section
                    className="bg-gradient-to-t from-teal-200 to-teal-50 transition-colors duration-500 dark:bg-gradient-to-t dark:from-grey-800 dark:to-grey-800"
                    waveFillTop="fill-teal-300 dark:fill-grey-500 transition-colors duration-500"
                    waveFillMiddle="fill-teal-100 dark:fill-grey-600 transition-colors duration-500"
                    waveFillBottom="fill-teal-50 dark:fill-grey-700 transition-colors duration-500"
                >
                    <section className="container mx-auto px-8 py-8 lg:gap-4 lg:pt-36">
                        <div className="container mx-auto gap-6 px-8 py-4 text-grey-800 dark:text-white">
                            <h1 className="block text-center font-montserrat text-2xl font-bold leading-tight transition-colors duration-500 md:text-3xl xl:text-4xl xl:leading-normal">
                                Learn about Octopus
                            </h1>
                            <div className="container mx-auto min-w-min gap-6 px-8 py-16 md:max-w-max">
                                <Components.HTMLVideo
                                    srcWebM="/video/webm/a_quick_introduction_to_octopus.webm"
                                    srcMp4="/video/mp4/a_quick_introduction_to_octopus.mp4"
                                    title="A quick introduction to Octopus: the new primary research record for science"
                                    showCaption={false}
                                    controls={true}
                                    poster="/images/jpg/poster.jpg"
                                    width={800}
                                />
                            </div>

                            <div className="m-auto grid max-w-7xl grid-cols-1 gap-10 text-center md:grid-cols-4">
                                {heroContents.map((heroContent) => (
                                    <div key={heroContent.heading}>
                                        <h2 className="mb-2 block font-montserrat text-2xl font-bold ">
                                            {heroContent.heading}
                                        </h2>
                                        <p className="mb-10 block text-base ">{heroContent.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </Components.Section>
                <Components.SectionTwo
                    className="bg-gradient-to-t from-teal-200 to-teal-50 transition-colors duration-500 dark:bg-gradient-to-t dark:from-grey-800 dark:to-grey-700"
                    waveFillTop="fill-teal-500 dark:fill-grey-600 transition-colors duration-500"
                    waveFillMiddle="fill-teal-600 dark:fill-grey-700 transition-colors duration-500"
                    waveFillBottom="fill-teal-700 dark:fill-grey-800 transition-colors duration-500"
                >
                    <div className="container mx-auto gap-6 px-8 py-16">
                        <h1 className="block font-montserrat text-2xl font-bold leading-tight text-grey-800 transition-colors duration-500 dark:text-white md:text-3xl lg:mb-8 xl:text-4xl xl:leading-normal">
                            More about Octopus
                        </h1>
                    </div>
                    <main id="content" className="container mx-auto grid grid-cols-1 px-8 lg:grid-cols-8 lg:gap-16">
                        {/* Jump to aside bar */}
                        <aside className="relative col-span-2 hidden lg:block">
                            <div className="sticky top-28">
                                <h2 className="mb-2 block border-b border-grey-200 pb-2 font-montserrat font-semibold text-grey-700 transition-colors duration-500 dark:text-grey-50">
                                    Jump to:
                                </h2>
                                <>
                                    {sectionContents.map((sectionContent) => (
                                        <Components.Link
                                            key={sectionContent.id}
                                            href={`#${sectionContent.id}`}
                                            className="group mb-2 block w-fit rounded border-transparent outline-0 hover:underline focus:ring-2 focus:ring-yellow-400"
                                        >
                                            <span className="text-grey-800 transition-colors duration-500 group-hover:text-grey-500 dark:text-grey-50">
                                                {sectionContent.heading}
                                            </span>
                                        </Components.Link>
                                    ))}
                                    <Components.Link
                                        key="faq"
                                        href="#faq"
                                        className="group mb-2 block w-fit rounded border-transparent outline-0 hover:underline focus:ring-2 focus:ring-yellow-400"
                                    >
                                        <span className="text-grey-800 transition-colors duration-500 group-hover:text-grey-500 dark:text-grey-50">
                                            Frequently asked questions
                                        </span>
                                    </Components.Link>
                                </>
                            </div>
                        </aside>
                        {/* Sections of about page */}
                        <div className="grid grid-cols-1 gap-8 lg:col-span-6">
                            {sectionContents.map((sectionContent) => (
                                <div key={sectionContent.id} id={sectionContent.id}>
                                    <Components.Paper>
                                        <section className="container mx-auto rounded-xl px-8 pt-4 md:py-12">
                                            <h2 className="mb-6 block font-montserrat text-2xl font-bold text-grey-900 dark:text-teal-300 lg:col-span-2 xl:mb-8">
                                                {sectionContent.heading}
                                            </h2>
                                            {sectionContent.contents?.map(({ id, content }) => (
                                                <p
                                                    key={id}
                                                    className="mb-8 block font-inter text-lg text-grey-900 dark:text-grey-50"
                                                >
                                                    {content}
                                                </p>
                                            ))}
                                        </section>
                                    </Components.Paper>
                                </div>
                            ))}
                            {/* Frequently asked questions section */}
                            <div id="faq">
                                <Components.Paper>
                                    <section className="container mx-auto flex flex-col gap-6 rounded-xl px-8 py-2 md:py-12">
                                        <h2 className="mb-6 block font-montserrat text-2xl font-bold text-grey-900 dark:text-teal-300 lg:col-span-2 xl:mb-8">
                                            Frequently asked questions
                                        </h2>
                                        {faqContents.map((faqContent) => (
                                            <Components.Accordian
                                                key={faqContent.id}
                                                heading={faqContent.heading}
                                                content={faqContent.content}
                                            />
                                        ))}
                                    </section>
                                </Components.Paper>
                            </div>
                        </div>
                    </main>
                </Components.SectionTwo>
            </Layouts.Standard>
        </>
    );
};

export default About;
