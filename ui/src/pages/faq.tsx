import React from 'react';
import parse from 'html-react-parser';
import Head from 'next/head';
import { NextPage } from 'next';

import * as Components from '@/components';
import * as Layouts from '@/layouts';
import * as Config from '@/config';
import * as Types from '@/types';

const publicationTypes = Config.values.octopusInformation.publicationTypes;
const publicationTypeIds: Types.PublicationType[] = Object.keys(publicationTypes) as Types.PublicationType[];
const faqContents = [
    {
        title: 'What is Octopus?',
        href: 'what_octopus',
        id: 'what_octopus',
        heading: 'What is Octopus?',
        content: `
            <p className='mb-2'>Octopus sets out to be the new "primary research record": a place where researchers from all disciplines can freely record all of their research work without pressures such as the need for &apos;high impact&apos; or word counts affecting what they write (or do).</p>
            <p className='mb-2'>Publishing your work on Octopus establishes your priority immediately, and allows you to document your work in full detail, a bit like a patent office. This record can sit alongside a traditional academic paper or monograph: journals continue to be a good place to disseminate research summaries, particularly &apos;findings&apos;, to a wider audience.</p>
            <p className='mb-2'>If you want to publish your work in a journal, you can publish on Octopus before you submit (like a preprint), or after you have had a paper accepted (to provide fuller details, like a well-organised supplementary information).</p>
            <p className='mb-2'>Octopus publications are different from other publications. They are smaller units linked together, reflecting different stages of the research process. They can be published individually (e.g. just publishing data), without needing to fit it into the structure of a traditional journal article. To read more about Octopus' publication types, click <a className='underline' href='#pub_type_octopus' target='_blank'>here</a>.</p>
            <p>You can find out more about our aims <a className='underline' target='_blank' href='octopus-aims'>here</a>.</p>
        `
    },
    {
        title: 'Who runs Octopus?',
        href: 'who_octopus',
        id: 'who_octopus',
        heading: 'Who runs Octopus?',
        content: `
            <p>Octopus is managed in partnership by Jisc and Octopus Publishing CIC. Jisc is a not-for-profit company focused on tertiary education, research and innovation. Octopus Publishing CIC is a community interest company (not-for-profit) run by Alexandra Freeman, who founded Octopus. Through this partnership, Jisc and Octopus publishing CIC aim to deliver the platform as a free service for the benefit of researchers. Neither party stands to nor intends to profit from the provision of the platform.</p>
        `
    },
    {
        title: 'Why publish my research on Octopus?',
        href: 'why_octopus',
        id: 'why_octopus',
        heading: 'Why publish my research on Octopus?',
        content: `
            <p className='mb-2'>Publishing on Octopus is free, fast, and fair. You can establish priority on your work, get recognition from peers, and benefit from feedback at all stages of your research process.</p>
            <p className='mb-2'>Octopus is designed to address many of the current limitations in research publishing, which can be slow, expensive, and reduce effective sharing of work.</p>
            <p>The platform&apos;s publication structure, open peer review, and flagging function, help incentivise good research practice, minimising pressures for questionable research practices and causes of bias.</p>
        `
    },
    {
        title: 'Is my discipline supported by Octopus? ',
        href: 'discipline_octopus',
        id: 'discipline_octopus',
        heading: 'Is my discipline supported by Octopus? ',
        content: `<p>Yes. Though Octopus&apos;s eight publication types are most closely aligned with the scientific research process, researchers from all disciplines are welcome to use the platform.</p>`
    },
    {
        title: 'How do I publish my work on Octopus?',
        href: 'how_octopus',
        id: 'how_octopus',
        heading: 'How do I publish my work on Octopus?',
        content: `
            <p className='mb-2'>Any logged-in user can publish immediately. See <a href='#how_account_octopus' className='underline' target='_blank'>how do I create an account</a> for more information.</p>
            <p className='mb-2'>Octopus has eight publication types, each aligned with a stage of the research process.</p>
            <p className='mb-2'>All publications are hierarchically linked in a branching chain, which means your publication needs to be linked to at least one other work on Octopus. For example, you can&apos;t publish data unless the method/protocol is already published. This ensures that everything shared is easily found, and fully understandable to readers.</p>
            <p>For a step-by-step guide to publishing on Octopus, please visit our <a href='author-guide' className='underline' target='_blank'>author guide.</a></p>
        `
    },
    {
        title: 'Which publication type should I use?',
        href: 'pub_type_octopus',
        id: 'pub_type_octopus',
        heading: 'Which publication type should I use?',
        content:
            `<p className='mb-2'>Below are the eight publication types. You should select the one which matches where you are in the research process.</p>` +
            publicationTypeIds
                .map(
                    (type, index) =>
                        `<p className='mb-2 font-bold'>${publicationTypes[type].label}:</p><p ${index !== publicationTypeIds.length - 1 ? 'className="mb-2"' : ''}>${publicationTypes[type].faqDescription}</p>`
                )
                .join('')
    },
    {
        title: 'How do I format my publications?',
        href: 'how_format_octopus',
        id: 'how_format_octopus',
        heading: 'How do I format my publications?',
        content: `
            <p className='mb-2'>Each publication on Octopus is smaller than a traditional paper. They are linked together, meaning you do not need to include all the information from your &apos;research problem&apos; in your &apos;rationale/hypothesis&apos;, for example. You can format each publication how you like, and there are no minimum or maximum word counts on Octopus.</p>
            <p className='mb-2'>There is no &apos;abstract&apos; or formal sections within an Octopus publication. Acknowledgements should be given at the end of the main text.</p>
            <p className='mb-2'>You will be asked to enter the title and author information separately from the main text.</p>
            <p className='mb-2'>You will need to add references for each publication, including direct embedded permanent URLs (such as a DOI) where possible. You will add these in a separate box from your main text using any reference format you like. DOIs will be automatically recognised and made into links.</p>
            <p className='mb-2'>You will be asked for your institutional affiliations, in order to help institutions report on the work of their staff. You will also be asked for a funding statement and you&apos;ll be encouraged to look up your funder&apos;s ROR identifier to help funders track research outputs.</p>
            <p>Researchers working in fields with existing reporting guidelines (such as the EQUATOR guidelines for the biomedical sciences) should follow these to help them ensure readers have all the information they need.</p>
        `
    },
    {
        title: 'How do I create an account?',
        href: 'how_account_octopus',
        id: 'how_account_octopus',
        heading: 'How do I create an account?',
        content: `
            <p className='mb-2'>Every Octopus account is linked to a valid <a className='underline' href='https://orcid.org/' target="_blank">ORCID®</a> account. You can login using your ORCID credentials. See our <a href='${Config.urls.privacy.path}' className='underline' target='_blank'>privacy notice</a> for more information on the data we collect and process in order to provide this platform.</p>
            <p className="mb-2">ORCID is an independent non-profit organisation that provides a persistent identifier that distinguishes you from other researchers. It is a mechanism for linking your research outputs and activities to your iD. ORCID is integrated into many systems used by publishers, funders, institutions, and other research-related services. Learn more at <a href='https://orcid.org' className='underline' target='_blank'>ORCID.org.</a></p>
            <p>You must log in to Octopus using you ORCID iD to share your own work, or to interact with the work of others.</p>
        `
    },
    {
        title: 'Does each publication get a DOI?',
        href: 'how_doi_octopus',
        id: 'how_doi_octopus',
        heading: 'Does each publication get a DOI?',
        content: `<p>Yes, Octopus mints a DataCite DOI for each new publication.</p>`
    },
    {
        title: 'Is everything on Octopus open access?',
        href: 'open_access_octopus',
        id: 'open_access_octopus',
        heading: 'Is everything on Octopus open access?',
        content: `
            <p className='mb-2'>Yes. All research published on Octopus is made available under an open access license. Authors retain the copyright to their work.</p>
            <p className='mb-2'>Anyone can read publications without creating an account, but please check the license terms before you share, adapt, or build upon another&apos;s work.</p>
            <p>The platform is published under the open source license GPLv3. The platform code is available via our public <a href='https://github.com/Jisc/octopus' className='underline' target='_blank'>Github repository</a>. We invite any interested parties to participate in the ongoing development of the service and its features. See our <a href='${Config.urls.terms.path}' className='underline' target='_blank'>terms page</a> for more information.</p>
        `
    },
    {
        title: 'Which copyright license is used for Octopus publication?',
        href: 'copyright_octopus',
        id: 'copyright_octopus',
        heading: 'Which copyright license is used for Octopus publication?',
        content: `
            <p>All Octopus publications have a CC-BY 4.0 license. For more information, please visit the <a href='https://creativecommons.org/' className='underline' target='_blank'>Creative Commons website</a>. This is to ensure that Octopus publications fulfil the Open Access criteria of all funders.</p>
        `
    },
    {
        title: 'Will people steal my idea/data if I publish it?',
        href: 'steal_data_octopus',
        id: 'steal_data_octopus',
        heading: 'Will people steal my idea/data if I publish it?',
        content: `
            <p>Publishing on Octopus establishes your priority instantly to protect you against &apos;scooping&apos;. Once published your work can't be stolen. For example, you might publish a hypothesis which is later supported by data. If that data is collected by you, someone else, or many people, you still get credit for the hypothesis as the person who published it.</p>
        `
    },
    {
        title: 'Can I publish in both Octopus and a journal?',
        href: 'publish_octopus',
        id: 'publish_octopus',
        heading: 'Can I publish in both Octopus and a journal?',
        content: `
            <p className='mb-2'>Octopus is designed to sit alongside journals and other dissemination outlets, allowing these channels to specialise in delivering key findings to their audiences. Octopus acts like a &apos;patent office&apos; to record who has done what and when, and ensure the quality, integrity, and accessibility of all primary research.</p>
            <p className='mb-2'>Publishing work on Octopus shouldn&apos;t be barrier to publishing a traditional paper, just as publishing a preprint isn&apos;t. However, journal policies differ in how they treat material that has been previously published. <a href='https://beta.sherpa.ac.uk/' className='underline' target='_blank'>Sherpa</a> allows you to check the preprint policy of any journal. If in doubt, please check with the journal before publishing on Octopus.</p>
            <p>Royal Society Open Science has a specific partnership with Octopus, publishing manuscripts based on work that has been previously recorded on Octopus. To learn more about publishing with Royal Society Open Science, please visit their <a href='https://royalsocietypublishing.org/rsos/for-authors' className='underline' target='_blank'>information for authors page</a>.</p>
        `
    },
    {
        title: 'Why would I write an open peer review?',
        href: 'public_review_octopus',
        id: 'public_review_octopus',
        heading: 'Why would I write an open peer review?',
        content: `
            <p className='mb-2'>Reviewing is critical to good research, and encouraging good research is at the heart of Octopus.</p>
            <p className='mb-2'>All reviews are publicly available on Octopus. This enriches the research record, allowing readers to see the views and opinions raised by other experts and learn from varied perspectives on a topic. It is also a resource for those just beginning to participate in research, providing ways of thinking about a subject, and guiding good research practice. The authors of the publication being reviewed have the option to reversion their work taking into account major points raised by reviewers, and might even choose to invite those reviewers as co-authors on the new version.</p>
            <p>Open peer review, where reviewers&apos; names are published alongside their comments, contributes to the principles of openness, accountability, and collaboration which underpin the platform. But, more than that, on Octopus, a review is treated as an equal type of publication to any other. Every review you write will itself appear attached to your individual publication list. Treat it as carefully as any other piece of work you publish – and enjoy the credit you will get as a result.</p>
        `
    },
    {
        title: 'Can I edit my publication?',
        href: 'edit_octopus',
        id: 'edit_octopus',
        heading: 'Can I edit my publication?',
        content: `
            <p className='mb-2'>Yes, you can create a new version of work. The old version will still be visible on the platform, but the newest publication will show first. You can find out more about reversioning your work by visiting our <a href='author-guide' className='underline' target='_blank'>author guide</a>.</p>
            <p>Once a publication goes live it cannot be deleted unless there is a breach of our <a href='user-terms' className='underline' target='_blank'>user terms</a>.</p>
        `
    },
    {
        title: 'I think a publication should be removed, what do I do?',
        href: 'removed_octopus',
        id: 'removed_octopus',
        heading: 'I think a publication should be removed, what do I do?',
        content: `
            <p className='mb-2'>If you suspect plagiarism, copyright issues, ethical or scientific misconduct then you can use the &apos;red flag&apos; system to raise your concerns. You will select which issue to highlight from a list of predefined criteria and add comments to explain your concerns to the authors and other readers. You can submit red flags for multiple criteria if you need to.</p>
            <p className='mb-2'>The red flag will appear on the publication page immediately, highlighting your concern to other readers. Each red flag will generate an automated email to the publication&apos;s author(s), who will be able to respond to the issues raised via the platform. All comments will be available to be read alongside the red flag.</p>
            <p>The user who raised the red flag can also remove it, once they feel the issue has been resolved.</p>
        `
    },
    {
        title: "How do I revoke Octopus's access to my ORCID account?",
        href: 'revoke_orcid_access',
        id: 'revoke_orcid_access',
        heading: "How do I revoke Octopus's access to my ORCID account?",
        content: `
            <p className="mb-2">If you are logged into Octopus you can revoke access by clicking the &apos;Revoke ORCID Access&apos; button next to your ORCID record on your account.</p>
            <p className="mb-2">You can also revoke access to your ORCID record, on the ORCID website. To do this go to &apos;Trusted parties&apos; and delete Octopus from the list of trusted organizations.</p>
            <p className="mb-2">Both of these methods will log you out of Octopus. If you attempt to log in again after revoking access you&apos;ll be asked to "give Octopus permission to access your ORCID record" again.</p>
            <p>You will not be able to log into Octopus again without granting permission to access your ORCID record.</p>
        `
    },
    {
        title: 'How are related publications identified?',
        href: 'related_publications',
        id: 'related_publications',
        heading: 'How are related publications identified?',
        content: `
            <p className="mb-2">To avoid bias, Octopus does not use any sort of algorithm to identify related publications. Instead, whilst viewing a publication that has already been published, the related publications area displays publications that have been identified by readers as being related to the one currently being viewed.</p>
            <p className="mb-2">To make sure that this section contains useful links, after clicking through to a related publication, you are able to vote on whether or not you think it is in some way relevant to the one you just came from.</p>
            <p>If you know of another publication that is relevant to the one you are viewing, you can also use the “Suggest a link” option to add it to the list.</p>
        `
    }
];

const Faq: NextPage = (): JSX.Element => (
    <>
        <Head>
            <title>{Config.urls.faq.title}</title>
            <meta name="description" content={Config.urls.faq.description} />
            <meta name="og:title" content={Config.urls.faq.title} />
            <meta name="og:description" content={Config.urls.faq.description} />
            <meta name="keywords" content={Config.urls.faq.keywords.join(', ')} />
            <link rel="canonical" href={Config.urls.faq.canonical} />
        </Head>

        <Layouts.Standard fixedHeader={false}>
            {/* Frequently asked questions section */}
            <article className="container grid grid-cols-1 px-8 lg:grid-cols-8 lg:gap-16">
                <Components.PageTitle
                    text="Frequently asked questions"
                    className="col-span-1 mb-8 pt-10 lg:col-span-8 lg:pt-20"
                />

                <aside className="col-span-2 pt-2 lg:block">
                    <Components.PageContentsSidebar
                        jumpToList={faqContents.map(({ href, title }) => ({ href, title }))}
                    />
                </aside>
                <div className="pt-14 lg:col-span-6 lg:pt-0">
                    {faqContents.map((faqContent) => (
                        <section key={faqContent.id} id={faqContent.id} className="mx-auto pt-4 lg:w-10/12">
                            <Components.PublicationCreationStepTitle text={faqContent.heading} />
                            <div className="mb-14 pt-2 text-sm leading-6 text-grey-600 transition-colors duration-500 dark:text-grey-200">
                                {parse(faqContent.content)}
                            </div>
                        </section>
                    ))}
                </div>
            </article>
        </Layouts.Standard>
    </>
);

export default Faq;
