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
        title: 'Why would I want to publish in Octopus?',
        href: 'why_octopus'
    },
    {
        title: 'How do I publish?',
        href: 'how_do_i_publish'
    },
    {
        title: 'What about copyright?',
        href: 'copyright'
    },
    {
        title: 'What is the rating system?',
        href: 'rating_system'
    },
    {
        title: 'Can I publish in both Octopus and a journal?',
        href: 'publish_in_other_journals_too'
    },
    {
        title: "Won't people steal my ideas/data if I publish it?",
        href: 'steal_ideas'
    },
    {
        title: 'Does each publication get a DOI?',
        href: 'doi'
    },
    {
        title: 'If this is only a beta version, when will Octopus launch?',
        href: 'when_will_octopus_launch'
    },
    {
        title: 'Why would I write a public review?',
        href: 'why_write_a_public_review'
    },
    {
        title: 'How do I format my publications?',
        href: 'formatting_publications'
    },
    {
        title: 'Someone has pointed out a really important issue in a review - can I retract?',
        href: 'how_can_i_retract'
    },
    {
        title: 'I think a publication should be retracted!',
        href: 'publication_should_be_retracted'
    }
];

const faqContents = [
    {
        id: 'why_octopus',
        heading: 'Why would I want to publish in Octopus?',
        content:
            "<p className='mb-2'>Octopus is designed to replace journals and papers as the primary research record. The traditional system is not only slow and expensive, but the concept of &apos;papers&apos; is not a good way of disseminating scientific work in the 21st century. By forcing people to share their work only when they get to the end of what can be a very long research process, it slows down the spread of scientific knowledge, and encourages &apos;questionable research practices&apos; in order for researchers to produce seemingly easy, clear narratives that will get their work widely read.</p> <p className='mb-2'>Good science isn&apos;t necessarily a good story. Good science can be the careful collection of a small amount of data, or careful analysis of data collected by someone else, or a good hypothesis (regardless of whether data later supports it or not).</p> <p className='mb-2'>Publishing in Octopus is free, fast, and meritocratic. Why hold on to a hypothesis? Publish it now and establish priority – once it&apos;s out in Octopus it&apos;s yours. Why hold onto your data? Publish that now and regardless of what analyses are done by you or others later, the credit for that data is yours.</p> <p className='mb-2'>Just like work put on preprint servers, publishing in Octopus doesn't stop you publishing an old-fashioned paper later.</p>"
    },
    {
        id: 'how_do_i_publish',
        heading: 'How do I publish?',
        content:
            "<p className='mb-2'>Octopus accepts 8 types of publication — all must be linked to another publication somewhere in Octopus.</p><p className='mb-2'>The top of any &apos;chain&apos; is a publication that is defining a scientific Problem. Below that you can publish a Hypothesis (theoretical rationale), below that a Method/Protocol, below that Data/Results, below that Analysis, below that an Interpretation (Discussion) and below that Applications or translations in the real world.</p><p className='mb-2'>Reviews can be published attached to any of those 7 other types of publication. </p><p className='mb-2'>To find out more about the publication types, visit our About page.</p><p className='mb-2'>To publish, click on &apos;Publish&apos; and follow the steps."
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
            'When the rating system is implemented in Octopus, every publication in Octopus can be rated by logged-in readers (i.e. people with an ORCiD). Each type of publication has 3 pre-defined criteria on which you are asked to rate it. These allow us to define what we as a scientific community consider &apos;good science&apos;, and allow authors to get truly meritocratic feedback and reward for their work. Everything you rate will be associated with your username, so it will be obvious if you rate people in a partisan manner.'
    },
    {
        id: 'publish_in_other_journals_too',
        heading: 'Can I publish in both Octopus and a journal?',
        content:
            "<p className='mb-2'>Octopus is designed to replace journals as the primary research record, allowing journals to concentrate on editorialising primary research and disseminating it in a suitable form to their specific readerships. However, in the medium term, many people will want to continue writing papers and recording work first in Octopus should be no barrier to that. Journal policies differ in how they treat material that has been previously published, such as on a preprint server. We recommend that you check whether your intended journal objects before publishing in Octopus."
    },
    {
        id: 'steal_ideas',
        heading: "Won't people steal my ideas/data if I publish it?",
        content:
            "<p className='mb-2'>Once you&apos;ve published something, it can&apos;t be stolen - it&apos;s yours. Publishing to Octopus quickly can establish your priority.</p><p className='mb-2'>If your hypothesis is later supported by data, it doesn&apos;t matter whether that data is collected by you or someone else or by many people: it&apos;s you that published the hypothesis and you that gets the credit for that. Similarly, if you have published the data, that&apos;s a publication already under your belt. You can also publish an analysis of that data - and so can other people."
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
            'This is our first major iteration of Octopus, and we are collating feedback whilst we add in the rest of the features we want for launch. We hope to launch fully in 2022. If you want to help, please email alex.freeman@maths.cam.ac.uk!'
    },
    {
        id: 'why_write_a_public_review',
        heading: 'Why would I write a public review?',
        content:
            "<p className='mb-2'>Reviewing and rating is critical to good science. Open peer review, where readers can read the reviews and opinions of others is important as it allows people to learn from the views of those with different experience and knowledge.</p><p className='mb-2'>In Octopus, a review is treated as an equal type of publication to any other, so every review you write will itself appear attached to your individual publication list and will be rated by others. Treat it as carefully as any other piece of work you publish - and enjoy the credit you will get as a result.</p><p className='mb-2'>Some people are concerned about writing open critiques of others&apos; work. We believe that no one writing a genuine, well-argued critique of another&apos;s work is likely to face any backlash, but are considering implementing a system whereby ALL publications in Octopus remain anonymous for their first few months, allowing double-blind reviewing.</p>"
    },
    {
        id: 'formatting_publications',
        heading: 'How do I format my publications?',
        content:
            "<p className='mb-2'>Because each publication in Octopus is smaller than an old-fashioned paper, you will no longer need to spend time writing an Introduction etc for each publication. What you will now publish as a Problem will be roughly the equivalent to a traditional paper&apos;s introduction. A Hypothesis directly following that will therefore no longer need to include all the information in that Problem, though may refer to other publications that support the scientific basis for the hypothesis. Similarly, publishing Results/Data will no longer require you to write out the Method, merely link to the published Method you followed, and add only relevant specific details (such as the dates of data collection, batch numbers of reagents, model numbers of equipment etc).</p><p className='mb-2'>References should no longer all be listed at the end of a publication. Since all publication is now online, direct embedded permanent URLs (eg. DOIs) should be used.</p><p className='mb-2'>Acknowledgements should still be given at the end of a publication.</p><p className='mb-2'>For researchers in biomedical sciences, the EQUATOR guidelines on reporting should still be followed.</p><p className='mb-2'>You can format your own publications in the online editor within Octopus to be sure that you get it to look exactly as you want. No more enforced styles, limited words or figures/tables. And no more time/money wasted proof-reading and sending comments back to Editors.</p>"
    },
    {
        id: 'how_can_i_retract',
        heading: 'Someone has pointed out a really important issue in a review - can I retract?',
        content:
            'No need for retraction for an innocent oversight. You can reversion your publication once the reversion functionality has been implemented in Octopus. The old version will still exist on file, but the new one will replace it. If a reviewer made such an important point, do consider offering them co-authorship, but at the minimum, add an acknowledgement.'
    },
    {
        id: 'publication_should_be_retracted',
        heading: 'I think a publication should be retracted!',
        content:
            "If you suspect plagiarism, copyright issues, ethical or scientific misconduct then you will can click to use the Red Flag system to raise your concerns. This will email the authors and you will enter a &apos;dispute resolution&apos; centre. The publication will immediately be flagged so that it is clear to others that an issue has been raised. If the dispute is not quickly resolved, the issue will be escalated to the authors' institutional Research Integrity Office, or their national office."
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
                    <aside className="col-span-2 lg:block">
                        <Components.FaqSidebar jumpToList={questionsAside} />
                    </aside>
                    <div className="lg:col-span-6">
                        {faqContents.map((faqContent) => (
                            <div key={faqContent.id} id={faqContent.id} className="mx-auto w-10/12 pt-2">
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
