import React from 'react';
import parse from 'html-react-parser';
import { NextPage } from 'next';
import Head from 'next/head';

import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Assets from '@assets';

type Props = {
    faqContents: [{ href: string; title: string; content: string }];
};

const questionsAside = [
    {
        title: 'Why publish in Octopus?',
        href: 'why_octopus'
    },
    {
        title: 'How do I publish?',
        href: 'how_do_i_publish'
    },
    {
        title: 'How do I format my publications?',
        href: 'formatting_publications'
    },
    {
        title: 'Does each publication get a DOI?',
        href: 'doi'
    },
    {
        title: 'What about copyright?',
        href: 'copyright'
    },
    {
        title: "Won't people steal my ideas/data if I publish it?",
        href: 'steal_ideas'
    },
    {
        title: 'Can I publish in both Octopus and a journal?',
        href: 'publish_in_other_journals_too'
    },
    {
        title: 'What is the rating system?',
        href: 'rating_system'
    },
    {
        title: 'Why would I write a public review?',
        href: 'why_write_a_public_review'
    },
    {
        title: 'Someone has pointed out a really important issue in a review - can I retract?',
        href: 'how_can_i_retract'
    },
    {
        title: 'I think a publication should be retracted!',
        href: 'publication_should_be_retracted'
    },
    {
        title: 'If this is only an alpha version, when will Octopus launch?',
        href: 'when_will_octopus_launch'
    }
];

const faqContents = [
    {
        id: 'why_octopus',
        heading: 'Why publish in Octopus?',
        content:
            "<p className='mb-2'>Publishing in Octopus is free, fast, and fair.</p><p className='mb-2'>So, you can immediately establish priority on your work, get recognition from peers, and benefit from feedback at all stages of your research.</p><p className='mb-2'>Octopus is designed to address many of the failings of the current system, which is not only slow and expensive, but also limits the spread of knowledge.</p><p className='mb-2'>It recognises that good research is more than a headline-grabbing journal article, it could be a well-thought-out hypothesis or a piece of lateral-thinking that leads to a new rationale that could solve a problem; it could be an intricately-designed protocol, described in scuch a way that it can be followed precisely by others, ensuring reproducibility; it could be carefully collected data, meticulously recorded with all the details others would need to interrogate it or analyse it in different ways &mdash; regardless of what that data reveals; it could be a thorough analysis of some data, or meta-analysis, a re-analysis of existing data using new techniques; it could be an insight into a new interpretation of the findings, or a way in which those findings could be used in the real world to provide benefit. Or, it could be a constructive and insightful critique of the work of others.</p><p className='mb-2'>All of these are research work. All of them should be shared and valued by the research community.</p><p className='mb-2'>Octopus also aims to incentivise good research practice (and minimise pressures for questionable research practicecs) through the way it is structured and its review and ratings systems, as well as minimising causes of bias (such as gender or institutional biases)</p><p className='mb-2'>Octopus sets out aims to be the new primary research record: a place where researchers from all disciplines can freely document all of their efforts and findings without external requirements unduly shaping their outputs. This complements the traditional paper, which continues to be a good place to disseminate research summaries (and particularly &apos;findings&apos;) to a wider audience: publishing in Octopus doesn't stop you publishing in a journal down the line should you want &mdash; but it is the place where you establish your priority for all to see, and document your work in full detail in order to do so, rather like a patent office. Our aim is that the different structure of Octopus will help researchers approach their work differently and allow people to concentrate on excellence rather than chasing &apos;impact&apos;.</p>"
    },
    {
        id: 'how_do_i_publish',
        heading: 'How do I publish?',
        content:
            "<p className='mb-2'>There are eight types of publication in Octopus align with the stages of scientific research. You should select the one which matches where you are in your research. Note that the publication type cannot be changed once you&apos;ve started drafting a publication.</p><p className='mb-2'>To publish, click on &apos;Publish&apos; and follow the steps.</p><p className='mb-2'>The eight publication types are:</p><p>A Problem:<p className='mb-2'>A Problem publication defines a research problem or question. You will need to explain what is known so far about the problem &mdash; rather like the &apos;Introduction&apos; to a traditional paper.</p><p>A Hypothesis/Rationale:</p><p className='mb-2'>A Hypothesis/Rationale publication sets out the theoretical basis for a potential solution, or partial solution, to the Problem it is linked to. In some fields a formal hypothesis is appropriate, and in some fields it will be more a description of an approach that might be taken.</p><p>A Protocol/Method:</p><p className='mb-2'>A Protocol/Method publication describes in detail a way of testing a hypothesis, or carrying out a theoretical rationale. You can include links to sites such as protocols.io to give more detail of the method if that would be helpful to readers.</p><p>Results/Data:</p><p className='mb-2'>A Results/Data publication comprises raw data or summarised results collected according to an existing published Protocol/Method. It should only describe the data or results themselves, without any analysis, along with details of the exact conditions under which the method was carried out &mdash; anything that might be needed for an analysis or interpretation of the results. You can include links to the raw data files.</p><p>An Analysis:</p><p className='mb-2'>An Analysis publication describes manipulations of results to help conclusions be drawn from them. For example, thematic or statistical analysis.</p><p>An Interpretation:</p><p className='mb-2'>An Interpretation publication describes conclusions drawn from an Analysis of results.</p><p>A Real-world Application:</p><p className='mb-2'>An Application publication describes how findings might have (or have had) an impact in the real world. This might be through a practical or policy application, and would be the appropriate publication type for Case Studies.</p><p>A (Peer) Review:</p><p className='mb-2'>A Review publication should be a carefully considered and constructive critique of an existing publication by someone else. Your review should help other readers assess the publication, and should be written in the same style as any other kind of publication (with relevant references). Authors may reversion publications in the light of reviews.</p>"
    },
    {
        id: 'formatting_publications',
        heading: 'How do I format my publications?',
        content:
            "<p className='mb-2'>Because each publication in Octopus is smaller than an old-fashioned paper, you will no longer need to spend time writing an Introduction etc for each publication. What you will now publish as a Problem will be roughly the equivalent to a traditional papers Introduction. A Hypothesis directly following that will therefore no longer need to include all the information in that Problem, though may refer to other publications that support the scientific basis for the hypothesis. Similarly, publishing Results/Data will no longer require you to write out the Method, merely link to the published Method you followed, and add only relevant specific details (such as the dates of data collection, batch numbers of reagents, model numbers of equipment etc).</p><p className='mb-2'>References should no longer all be listed at the end of a publication. Since all publication is now online, direct embedded permanent URLs (eg. DOIs) should be used. Acknowledgements should still be given at the end of a publication.</p><p className='mb-2'>For researchers whose fields already have reporting guidelines (such as the EQUATOR guidelines for the biomedical sciences), these should still be followed.</p><p className='mb-2'>You can format your own publications in the online editor within Octopus to be sure that you get it to look exactly as you want. No more enforced styles, limited words or figures/tables. And no more time/money wasted proof-reading and sending comments back to Editors.</p>"
    },
    {
        id: 'doi',
        heading: 'Does each publication get a DOI?',
        content:
            "<p className='mb-2'>The beta version of Octopus will mint a DOI for each new publication via Datacite.</p><p className='mb-2'>At the moment, for alpha testing, we are using our own unique IDs.</p>"
    },
    {
        id: 'copyright',
        heading: 'What about copyright?',
        content:
            "<p className='mb-2'>When Octopus allows you to select a Creative Commons copyright label. This will ensure that you can retain your intellectual property rights as the author, but that others can use your work in the way that you want.</p>The Octopus codebase is Open Source, and is available under the GNU General Public License version 3."
    },
    {
        id: 'steal_ideas',
        heading: "Won't people steal my ideas/data if I publish it?",
        content:
            'Publishing to Octopus establishes your priority quickly. Once you&apos;ve published something, it can&apos;t be stolen - it&apos;s yours. If your hypothesis is later supported by data, it doesn&apos;t matter whether that data is collected by you or someone else or by many people: it&apos;s you that published the hypothesis and you that gets the credit for that. Similarly, if you have published the data, that&apos;s a publication already under your belt. You can also publish an analysis of that data - and so can other people.'
    },
    {
        id: 'publish_in_other_journals_too',
        heading: 'Can I publish in both Octopus and a journal?',
        content:
            'Octopus is designed to replace journals as the primary research record, allowing journals to concentrate on editorialising primary research findings and disseminating them in a suitable form to their specific readerships. However, in the medium term, many people will want to continue writing papers, and recording work first in Octopus should be no barrier to that. Journal policies differ in how they treat material that has been previously published, such as on a preprint server. We recommend that you check whether your intended journal objects before publishing in Octopus.'
    },
    {
        id: 'rating_system',
        heading: 'What is the rating system?',
        content:
            "<p className='mb-2'>Every publication in Octopus can be rated by logged-in users</p><p className='mb-2'>Each type of publication has 3 pre-defined criteria on which you can rate it. These allow us to define what we as a scientific community consider &apos;good work&apos;, and allow authors to get truly meritocratic feedback and reward for their work.</p>Please note that every rating you give will be visible on your user account."
    },
    {
        id: 'why_write_a_public_review',
        heading: 'Why would I write a public review?',
        content:
            "<p className='mb-2'>Reviewing and rating is critical to good research, and encouraging good research is at the heart of Octopus..</p><p className='mb-2'>All reviews are publicly available on Octopus. This enriches the scientific record, allowing readers to see the views and opinions raised by other experts and learn from varied perspectives on a topic. It is also a resource for those just beginning to participate in research, providing ways of thinking about a subject, and guiding good research practice. For the authors of the publication being reviewed, they always have the option to reversion their work taking into account major points raised by early reviewers, and might even choose to invite those reviewers as co-authors on the new version. This new version of a publication may affect all the work done subsequently in the chain.</p>Open peer review, where reviewers&apos; names are published alongside their comments, contributes to the principles of openness, accountability, and collaboration which underpin the platform. In Octopus, a review is treated as an equal type of publication to any other, so every review you write will itself appear attached to your individual publication list. Treat it as carefully as any other piece of work you publish &mdash; and enjoy the credit you will get as a result."
    },
    {
        id: 'how_can_i_retract',
        heading: 'Someone has pointed out a really important issue in a review - can I retract?',
        content:
            "<p className='mb-2'>Once a publication goes live it cannot be deleted unless it breaks our contribution guidelines.</p>However, you can create a new version of your publication. The old version will still exist on the platform, but the new one will replace it."
    },
    {
        id: 'publication_should_be_retracted',
        heading: 'I think a publication should be retracted!',
        content:
            "<p className='mb-2'>If you suspect plagiarism, copyright issues, ethical or scientific misconduct then you can use the Red Flag system to raise your concerns. Select which issue to highlight from a list of predefined criteria and add explanatory comments to explain your concerns to the authors and other readers. You can submit red flags for multiple criteria if you need to.</p><p className='mb-2'>The red flag will immediately appear on the publication page to highlight your concern to other readers. Each red flag will also generate an automated email to all the publication&apos;s authors, who will be able to respond to the issues raised through the platform. All comments will be available to be read alongside red flag.<p className='mb-2'>The user who raised the red flag can also remove it, once they feel the issue has been resolved. In the early life of the platform the Octopus team will monitor the use of this feature. Longer-term our aim is to escalate long-standing issues to the authors' institutional Research Integrity Office, or their national office."
    },
    {
        id: 'when_will_octopus_launch',
        heading: 'If this is only an alpha version, when will Octopus launch?',
        content:
            "<p className='mb-2'>The platform will launch in June 2022.</p><p className='mb-2'>The alpha release has reduced features and functionality for now, but additional features will be added for testing prior to launch.</p><p className='mb-2'>We are currently gathering user feedback to ensure that the platform meets your needs, and that we prioritise the features of most value to you."
    }
];

const Faq: NextPage<Props> = (props): JSX.Element => (
    <>
        <Head>
            <meta name="description" content={Config.urls.faq.description} />
            <meta name="keywords" content={Config.urls.faq.keywords.join(', ')} />
            <link rel="canonical" href={Config.urls.faq.canonical} />
            <title>{Config.urls.faq.title}</title>
        </Head>

        <Layouts.Standard fixedHeader={false}>
            <Components.SectionTwo
                className="bg-teal-50 dark:bg-grey-800"
                waveFillTop="fill-teal-100 dark:fill-grey-500 transition-colors duration-500"
                waveFillMiddle="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                waveFillBottom="fill-teal-700 dark:fill-grey-800 transition-colors duration-500"
            >
                {/* Frequently asked questions section */}
                <section className="container mx-auto px-8 pb-10 pt-10 lg:gap-4 lg:pt-20">
                    <Components.PageTitle text="Frequently asked questions" />
                </section>

                <section className="container mx-auto grid grid-cols-1 px-8 lg:grid-cols-8 lg:gap-16">
                    <aside className="col-span-2 pt-4 lg:block">
                        <Components.FaqSidebar jumpToList={questionsAside} />
                    </aside>
                    <div className="lg:col-span-6 ">
                        {faqContents.map((faqContent) => (
                            <div key={faqContent.id} id={faqContent.id} className="mx-auto w-10/12 pt-4">
                                <dl className="divide-y">
                                    <dt className="mb-1 text-lg font-medium leading-6 text-grey-900 transition-colors duration-500 dark:text-white">
                                        {faqContent.heading}
                                    </dt>
                                    <dd className="mb-14 pt-2 text-base leading-6 text-grey-600 transition-colors duration-500 dark:text-grey-200">
                                        {parse(faqContent.content)}
                                    </dd>
                                </dl>
                            </div>
                        ))}
                    </div>
                </section>
            </Components.SectionTwo>
        </Layouts.Standard>
    </>
);

export default Faq;
