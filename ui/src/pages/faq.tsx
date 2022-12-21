import React from 'react';
import parse from 'html-react-parser';
import Head from 'next/head';
import { NextPage } from 'next';

import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Config from '@config';

type Props = {
    faqContents: [{ href: string; title: string; content: string }];
};

const faqContents = [
    {
        title: 'What is Octopus?',
        href: 'what_octopus',
        id: 'what_octopus',
        heading: 'What is Octopus?',
        content:
            "<p className='mb-2'>Octopus sets out to be the new primary research record: a place where researchers from all disciplines can freely record all of their efforts and findings without external requirements unduly shaping their outputs.</p><p className='mb-2'>This complements the traditional paper, which continues to be a good place to disseminate research summaries (and particularly ‘findings’) to a wider audience: publishing in Octopus doesn't stop you publishing in a journal down the line should you want – but it is the place where you establish your priority for all to see, and document your work in full detail in order to do so, rather like a patent office.</p> <p className='mb-2'>Our aim is that the different structure of Octopus will help researchers approach their work differently and allow people to concentrate on excellence rather than chasing ‘impact’.</p> "
    },
    {
        title: 'Why record your research on Octopus?',
        href: 'why_octopus',
        id: 'why_octopus',
        heading: 'Why record your research on Octopus?',
        content:
            "<p className='mb-2'>Publishing in Octopus is free, fast, and fair.</p><p className='mb-2'>So, you can immediately establish priority on your work, get recognition from peers, and benefit from feedback at all stages of your research.</p> <p className='mb-2'>Octopus is designed to address many of the failings of the current system, which is not only slow and expensive, but also limits the spread of knowledge.</p><p className='mb-2'>Octopus also aims to incentivise good research practice (and minimise pressures for questionable research practices) through the way it is structured and its review and red flag, as well as minimising causes of bias (such as gender or institutional biases)</p> <p className='mb-2'> It recognises that good research is more than a headline-grabbing journal article, it could be a well-thought-out hypothesis or a piece of lateral-thinking that leads to a new rationale that could solve a problem; it could be an intricately-designed protocol, described in such a way that it can be followed precisely by others, ensuring reproducibility; it could be carefully collected data, meticulously recorded with all the details others would need to interrogate it or analyse it in different ways – regardless of what that data reveals; it could be a thorough analysis of some data, or meta-analysis, a re-analysis of existing data using new techniques; it could be an insight into a new interpretation of the findings, or a way in which those findings could be used in the real world to provide benefit. Or, it could be a constructive and insightful critique of the work of others.</p><p className='mb-2'>All of these are research work. All of them should be shared and valued by the research community.</p>"
    },
    {
        title: 'Is my discipline supported by Octopus? ',
        href: 'discipline_octopus',
        id: 'discipline_octopus',
        heading: 'Is my discipline supported by Octopus? ',
        content:
            "<p className='mb-2'>Initially, Octopus&apos;s 8 publication types are most closely aligned with the scientific research process. These are problem, hypothesis, method, results, analysis, interpretation, real-world application and peer review. However, researchers from all disciplines are welcome to use the platform.</p><p className='mb-2'>As we continue to develop Octopus, we plan to directly support academics who use other research processes. We are planning a discovery period to better understand the requirements of these disciplines and anyone interested in participating can get involved by messaging help@jisc.ac.uk. </p>"
    },
    {
        title: 'How do I record my work to Octopus?',
        href: 'how_octopus',
        id: 'how_octopus',
        heading: 'How do I record my work to Octopus?',
        content:
            "<p className='mb-2'>Any logged-in user can publish immediately to Octopus. See <a href='faq#how_account_octopus' className='underline'>how to create an Octopus account</a>.<p className='mb-2'>There are 8 types of publication on Octopus, each aligned with a stage of the scientific process. You can publish each stage as you conduct your research, or at the end of your project. Other users can also link their works to yours – for instance, each stage of a collaborative project might be published by a different member of the team to reflect the work they were most closely involved with, or another researcher might be inspired to respond to your work.</p><p className='mb-2'>All Octopus publications are hierarchically linked in a collaborative chain, which means your publication needs to be linked to at least one other work on Octopus. The start of any chain is a scientific Research Problem, from which can be linked a hypothesis/rationale, and from that a method/protocol, and so on. Most publications can only be linked to the type preceding it in the chain. However problems and reviews can be linked from any of the other publication types.</p>"
    },

    {
        title: 'Which publication type should I use?',
        href: 'pub_type_octopus',
        id: 'pub_type_octopus',
        heading: 'Which publication type should I use?',
        content:
            "<p className='mb-2'>There are eight types of publication in Octopus align with the stages of scientific research. You should select the one which matches where you are in your research.</p><p className='mb-2'>The 8 publication types are:</p><p className='mb-2 font-bold'>Research Problem</p><p className='mb-2'>A Research Problem publication defines a research problem or question. You will need to explain what is known so far about the problem – rather like the ‘Introduction’ to a traditional paper.</p><p className='mb-2 font-bold'>Rationale/Hypothesis:</p><p className='mb-2'>A Rationale/Hypothesis publication sets out the theoretical basis for a potential solution, or partial solution, to the Research Problem it is linked to. In some fields a formal hypothesis is appropriate, and in some fields it will be more a description of an approach that might be taken.</p><p className='mb-2 font-bold'>Method:</p><p className='mb-2'>A Method publication describes in detail a way of testing a hypothesis, or carrying out a theoretical rationale. You can include links to sites such as protocols.io to give more detail of the method if that would be helpful to readers.</p><p className='mb-2 font-bold'>Results:<p><p className='mb-2'>A Results publication comprises raw data or summarised results collected according to an existing published Method. It should only describe the data or results themselves, without any analysis, along with details of the exact conditions under which the method was carried out – anything that might be needed for an analysis or interpretation of the results. You can include links to the raw data files.</p><p className='mb-2 font-bold'>Analysis:</p><p className='mb-2'>An Analysis publication describes manipulations of results to help conclusions be drawn from them. For example, thematic or statistical analysis.</p><p className='mb-2 font-bold'>Interpretation:<p><p className='mb-2'>An Interpretation publication describes conclusions drawn from an Analysis of results.</p><p className='mb-2 font-bold'>Real World Application:<p><p className='mb-2'>An Application publication describes how findings might have (or have had) an impact in the real world. This might be through a practical or policy application, and would be the appropriate publication type for Case Studies.<p><p className='mb-2 font-bold'>Peer Review:</p><p className='mb-2 '>Octopus Reviews are open and post-publication. A Review publication should be a carefully considered and constructive critique of an existing publication by someone else. Your review should help other readers assess the publication, and should be written in the same style as any other kind of publication (with relevant references). Authors may reversion publications in the light of reviews.</p>"
    },
    {
        title: 'How do I format my publications?',
        href: 'how_format_octopus',
        id: 'how_format_octopus',
        heading: 'How do I format my publications?',
        content:
            "<p className='mb-2'>Because each publication in Octopus is smaller than an old-fashioned paper, you will no longer need to spend time writing an Introduction etc. for each publication. What you will now publish as a Research Problem will be roughly the equivalent to a traditional papers Introduction. A Rationale/Hypothesis directly following that will therefore no longer need to include all the information in that Research Problem, though may refer to other publications that support the scientific basis for the hypothesis. Similarly, publishing Results will no longer require you to write out the Method, merely link to the published Method you followed, and add only relevant specific details (such as the dates of data collection, batch numbers of reagents, model numbers of equipment etc).</p><p className='mb-2'>Where possible, references should include direct embedded permanent URLs (eg. DOIs).</p><p className='mb-2'>Similarly, funding statements and publication affiliations should use ROR identifiers to ensure that consistent, accurate organisational data is displayed. This also enables the more efficient discovery and tracking of research outputs across institutions and funding bodies.</p><p className='mb-2'>Acknowledgements should still be given at the end of a publication.</p><p className='mb-2'>For researchers whose fields already have reporting guidelines (such as the EQUATOR guidelines for the biomedical sciences), these should still be followed.</p><p className='mb-2'>You can format your own publications in the online editor within Octopus to be sure that you get it to look exactly as you want. No more enforced styles, word limits, or restrictions on the number of figures and tables. And no more time/money wasted proof-reading and sending comments back to Editors.</p>"
    },
    {
        title: 'How do I create an account?',
        href: 'how_account_octopus',
        id: 'how_account_octopus',
        heading: 'How do I create an account?',
        content: `<p className='mb-2'>Every Octopus account is linked to a valid <a className='underline' href='https://orcid.org/' target="_blank">ORCID®</a> account. You can login using your ORCID credentials. See our <a href='${Config.urls.privacy.path}' className='underline'>Privacy Notice</a> for more information on the data we collect and process in order to provide this platform.</p><p className="mb-2"> ORCID is an independent non-profit organization that provides a persistent identifier – an ORCID iD – that distinguishes you from other researchers and a mechanism for linking your research outputs and activities to your iD. ORCID is integrated into many systems used by publishers, funders, institutions, and other research-related services. Learn more at <a className='underline' href='https://orcid.org/' target="_blank">ORCID.org</a></p><p className='mb-2'>If you do not yet have an ORCID account, we encourage you to consider using this unique, persistent digital identifier developed specifically for researchers.</p><p className='mb-2'>Note that you must be logged-in to an Octopus account in order to share your own work, or to interact with the work of others.</p>`
    },
    {
        title: 'Does each publication get a DOI?',
        href: 'how_doi_octopus',
        id: 'how_doi_octopus',
        heading: 'Does each publication get a DOI?',
        content:
            "<p className='mb-2'>When fully launched, Octopus will mint a DOI for each new publication via DataCite.</p><p className='mb-2'>During this testing phase, we are using our own unique IDs. Note that any content published to the site now will not be retained post-launch.</p>"
    },
    {
        title: 'Is everything on Octopus open access?',
        href: 'open_access_octopus',
        id: 'open_access_octopus',
        heading: 'Is everything on Octopus open access?',
        content: `<p className='mb-2'>All research recorded on Octopus is made available under an open access license, and anyone can read this content without creating an account.</p><p className='mb-2'>However, authors retain the copyright to their work and can select which license they publish under. So, be sure to check on a case-by-case basis before you share, adapt, or build upon another’s work.</p><p className='mb-2'>The platform itself is published under the open-source license GPLv3. The platform code is available via our public <a href='https://github.com/JiscSD/octopus' className='underline'>Github repository</a>, and we invite any interested parties to participate in the ongoing development of the service and its features. See our <a href='${Config.urls.terms.path}' className='underline'>Terms page</a> for more information.</p>`
    },
    {
        title: 'What about copyright?',
        href: 'copyright_octopus',
        id: 'copyright_octopus',
        heading: 'What about copyright?',
        content:
            "<p className='mb-2'>When Octopus allows you to select a Creative Commons copyright license. This will ensure that you can retain your intellectual property rights as the author, but that others can use your work in the way that you want.</p>"
    },
    {
        title: 'Won’t people steal my ideas/data if I publish it?',
        href: 'steal_data_octopus',
        id: 'steal_data_octopus',
        heading: 'Won’t people steal my ideas/data if I publish it?',
        content:
            "<p className='mb-2'>Publishing to Octopus establishes your priority quickly. Once you've published something, it can't be stolen – it's yours. If your hypothesis is later supported by data, it doesn't matter whether that data is collected by you or someone else, or by many people: it's you that published the hypothesis and you that gets the credit for that. Similarly, if you have published the data, that's a publication already under your belt. You can also publish an analysis of that data if you like – and so can other people.</p>"
    },
    {
        title: 'Can I publish in both Octopus and a journal?',
        href: 'publish_octopus',
        id: 'publish_octopus',
        heading: 'Can I publish in both Octopus and a journal?',
        content:
            "<p className='mb-2'>Octopus is designed to sit alongside journals and other dissemination outlets, allowing these channels to specialise in delivering key findings to their audiences while Octopus acts like a ‘patent office’ to record who has done what and when, and ensure the quality, integrity and accessibility of all primary research, in full.</p><p className='mb-2'>Recording work to Octopus should be no barrier to publishing a traditional paper. However please note that journal policies differ in how they treat material that has been previously published, such as on a preprint server. If in doubt, we recommend that you check with your intended journal before publishing in Octopus.</p>"
    },
    {
        title: 'Why would I write a public review?',
        href: 'public_review_octopus',
        id: 'public_review_octopus',
        heading: 'Why would I write a public review?',
        content:
            "<p className='mb-2'>Reviewing is critical to good research, and encouraging good research is at the heart of Octopus.</p> <p className='mb-2'>All reviews are publicly available on Octopus. This enriches the scientific record, allowing readers to see the views and opinions raised by other experts and learn from varied perspectives on a topic. It is also a resource for those just beginning to participate in research, providing ways of thinking about a subject, and guiding good research practice. For the authors of the publication being reviewed, they always have the option to reversion their work taking into account major points raised by early reviewers, and might even choose to invite those reviewers as co-authors on the new version. This new version of a publication may affect all the work done subsequently in the chain.</p><p className='mb-2'>Open peer review, where reviewers’ names are published alongside their comments, contributes to the principles of openness, accountability, and collaboration which underpin the platform. In Octopus, a review is treated as an equal type of publication to any other, so every review you write will itself appear attached to your individual publication list. Treat it as carefully as any other piece of work you publish – and enjoy the credit you will get as a result.</p>"
    },
    {
        title: 'Someone has pointed out a really important issue in a review – can I edit my publication?',
        href: 'edit_octopus',
        id: 'edit_octopus',
        heading: 'Someone has pointed out a really important issue in a review – can I edit my publication?',
        content:
            "<p className='mb-2'>Once a publication goes live it cannot be deleted unless it breaks our contribution guidelines.</p><p className='mb-2'>We will shortly introduce the functionality that allows you to create a new version of your publication. The old version will still exist on the platform, but will be linked to the new one.</p>"
    },
    {
        title: 'I think a publication should be removed!',
        href: 'removed_octopus',
        id: 'removed_octopus',
        heading: 'I think a publication should be removed!',
        content:
            "<p className='mb-2'>If you suspect plagiarism, copyright issues, ethical or scientific misconduct then you can use the Red Flag system to raise your concerns. Select which issue to highlight from a list of predefined criteria and add explanatory comments to explain your concerns to the authors and other readers. You can submit red flags for multiple criteria if you need to.</p><p className='mb-2'>The red flag will immediately appear on the publication page to highlight your concern to other readers. Each red flag will also generate an automated email to all the publication’s authors, who will be able to respond to the issues raised through the platform. All comments will be available to be read alongside red flag.</p><p className='mb-2'>The user who raised the red flag can also remove it, once they feel the issue has been resolved</p>"
    },
    {
        title: 'If this is only an alpha version, when will Octopus launch?',
        href: 'launch_octopus',
        id: 'launch_octopus',
        heading: 'If this is only an alpha version, when will Octopus launch?',
        content:
            "<p className='mb-2'>The platform will launch in June 2022.</p><p className='mb-2'>The alpha release has reduced features and functionality for now, but additional features will be added for testing prior to launch. Please note that any content published to the site during the alpha stage will not be retained in the live version.</p><p className='mb-2'>We are currently gathering user feedback to ensure that the platform meets your needs, and that we prioritise the features of most value to you. Consider completing our feedback form, or joining our user community, to help us develop the platform further.</p>"
    },
    {
        title: "How do I revoke Octopus's access to my ORCID record?",
        href: 'revoke_orcid_access',
        id: 'revoke_orcid_access',
        heading: "How do I revoke Octopus's access to my ORCID record?",
        content: `
            <p className="mb-2">If you are logged into Octopus you can revoke access by clicking the 'Revoke ORCID Access' button next to your ORCID record on your account.</p>
            <p className="mb-2">
                You can also revoke access to your ORCID record, on the ORCID website. To do this go to 'Trusted parties' and delete Octopus from the list of 'Trusted organizations'. 
            </p>
            <p className="mb-2">
                Both of these methods will log you out of Octopus. If you attempt to log in again after revoking access you'll be offered the chance to "Give Octopus Permission To Access Your ORCID Record" again.
            </p>
            <p>
                You will not be able to log into Octopus again without granting permission to access your ORCID record.</p>
            </p>
        `
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
            {/* Frequently asked questions section */}
            <section className="container mx-auto px-8 pb-10 pt-10 lg:gap-4 lg:pt-20">
                <Components.PageTitle text="Frequently asked questions" />
            </section>

            <section className="container mx-auto grid grid-cols-1 px-8 lg:grid-cols-8 lg:gap-16">
                <aside className="col-span-2 pt-2 lg:block">
                    <Components.FaqSidebar jumpToList={faqContents.map(({ href, title }) => ({ href, title }))} />
                </aside>
                <div className="pt-14 lg:col-span-6 lg:pt-0">
                    {faqContents.map((faqContent) => (
                        <div key={faqContent.id} id={faqContent.id} className="mx-auto pt-4 lg:w-10/12">
                            <dl>
                                <dt>
                                    <Components.PublicationCreationStepTitle text={faqContent.heading} />
                                </dt>
                                <dd className="mb-14 pt-2 text-sm leading-6 text-grey-600 transition-colors duration-500 dark:text-grey-200">
                                    {parse(faqContent.content)}
                                </dd>
                            </dl>
                        </div>
                    ))}
                </div>
            </section>
        </Layouts.Standard>
    </>
);

export default Faq;
