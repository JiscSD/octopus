import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import * as Framer from 'framer-motion';

import * as Components from '@/components';
import * as Layouts from '@/layouts';
import * as Config from '@/config';
import * as Types from '@/types';

type PageSectionProps = {
    children: React.ReactNode;
};

type TextProps = {
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

const StandardText: React.FC<TextProps> = (props): React.ReactElement => {
    return (
        <span className="text-l mx-auto mb-5 block font-montserrat font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100 lg:text-xl">
            {props.children}
        </span>
    );
};

const AuthorGuide: NextPage = (): React.ReactElement => (
    <>
        <Head>
            <title>{Config.urls.authorGuide.title}</title>
            <meta name="description" content={Config.urls.authorGuide.description} />
            <meta name="og:title" content={Config.urls.authorGuide.title} />
            <meta name="og:description" content={Config.urls.authorGuide.description} />
            <meta name="keywords" content={Config.urls.authorGuide.keywords.join(', ')} />
            <link rel="canonical" href={Config.urls.authorGuide.canonical} />
        </Head>

        <Layouts.Standard fixedHeader={false}>
            <PageSection>
                <>
                    <div className="mx-auto block lg:w-9/12 xl:w-10/12 2xl:w-7/12">
                        <h1 className="mb-5 mt-5 block text-center font-montserrat text-3xl font-black !leading-tight tracking-tight text-grey-700 transition-colors duration-500 dark:text-white-50 lg:text-5xl">
                            Author guide to publishing on Octopus.
                        </h1>
                        <StandardText>
                            Octopus publications are not equivalent to journal articles or papers. Instead, there are 8
                            smaller publication types aligned with the research process.
                        </StandardText>
                        <StandardText>
                            <>
                                Think of Octopus like a &apos;patent office&apos; where you can register all your work,
                                including theories, data, and analyses. However, when you start the publication process,
                                consider it to be like submitting to a journal. Whatever you publish should be the
                                formal &apos;version of record&apos;, ready to be assessed by others and publicly
                                recorded against your name and{' '}
                                <Components.Link
                                    href="https://orcid.org/"
                                    openNew={true}
                                    className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                >
                                    ORCID iD.
                                </Components.Link>
                            </>
                        </StandardText>
                        <StandardText>
                            <>
                                You might want to have a look at some example publications of the different types before
                                writing your own.{' '}
                                <Components.Link
                                    href="https://www.octopus.ac/faq#pub_type_octopus"
                                    openNew={true}
                                    className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                >
                                    Here
                                </Components.Link>{' '}
                                is a handy guide to the eight types. It is most likely that your first publication will
                                be of a Research Problem.{' '}
                                <Components.Link
                                    href="https://www.octopus.ac/publications/gv8n-ap77"
                                    openNew={true}
                                    className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                >
                                    Here
                                </Components.Link>{' '}
                                is an example of what a Research Problem publication might look like. You can see other
                                publication types linked to that one.
                            </>
                        </StandardText>
                        <StandardText>When you&apos;re ready to publish, you will need to have to hand:</StandardText>
                        <StandardText>
                            <ul className="ml-8 list-disc">
                                <li className="mb-8">Your publication title</li>
                                <li className="mb-8">Your main publication text and references</li>
                                <li className="mb-8">The email addresses of any co-authors</li>
                                <li className="mb-8">Information about any funders that should be acknowledged</li>
                                <li className="mb-8">
                                    Details of any conflicts of interest to be declared for all authors
                                </li>
                                <li className="mb-8">
                                    Your institutional affiliation(s), to make it easier for your work to be tracked and
                                    deposited in the correct repositories
                                </li>
                                <li className="mb-8">
                                    A publication already on Octopus to link yours to. If you re publishing a Research
                                    Problem, this could be a generic topic, such as ‘medicine’, but the more specific
                                    the better as it will help your publication be found and assimilated with other
                                    research on the topic.
                                </li>
                            </ul>
                        </StandardText>
                        <StandardText>
                            Publishing on Octopus is quick and easy by design. Here&apos;s a step-by-step guide to get
                            you started:
                        </StandardText>
                        <StandardText>
                            <ul className="ml-8 list-disc">
                                <li className="mb-8">
                                    <span className="font-bold">Sign in</span> using your ORCID® credentials (or create
                                    an ORCID account if you don&apos;t have one). You will also need to provide a
                                    verified email address so that you can receive essential service notifications.
                                </li>
                            </ul>
                        </StandardText>
                        <Components.PageSubTitle text="Key information" />
                        <StandardText>
                            <ul className="ml-8 list-disc">
                                <li className="mb-6">
                                    <span className="font-bold">What kind of work are you ready to publish? </span>{' '}
                                    There are eight types in Octopus, from a well-defined Research Problem to a Real
                                    World Application. These are intended to align with the research process, so select
                                    the stage which matches where you are in your work.{' '}
                                    <Components.Link
                                        href={Config.urls.faq.path}
                                        openNew={true}
                                        className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                    >
                                        See our FAQ
                                    </Components.Link>{' '}
                                    for more information on the publication types. You can publish each stage as it
                                    happens, publish when the project is finished, or adapt existing papers to record
                                    prior work to Octopus.
                                </li>
                                <li className="mb-6">
                                    Click &apos;Publish&apos; on the navigation bar. Alternatively on any publication
                                    page you have the option to &apos;write a linked publication&apos; or to &apos;write
                                    a review&apos;. You will be promoted to add a title and select the publication type.
                                    If you are writing a review or linked publication, the publication type will be
                                    automatically limited to available options. Note that publication type cannot be
                                    changed once a draft is created.
                                </li>
                                <li className="mb-6">
                                    Once you click &apos;Create this publication&apos;, a draft is created and you are
                                    taken to the full publication form. You can navigate to any page of the publication
                                    process. The review page will show you any missing required information. Once all
                                    essential information is provided, you can preview and publish your work.
                                </li>
                                <li className="mb-6">
                                    <span className="font-bold">What license should I select?</span> You have the option
                                    to select from several{' '}
                                    <Components.Link
                                        href="https://creativecommons.org/about/cclicenses/"
                                        openNew={true}
                                        className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                    >
                                        Creative Commons licenses.
                                    </Components.Link>{' '}
                                    Note that Octopus requires licenses which permit derivative works. This is so that
                                    we can develop certain features, such as automated translation. If you would like to
                                    use a license that is not listed, email{' '}
                                    <Components.Link
                                        href="mailto:help@jisc.ac.uk"
                                        openNew={true}
                                        className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                    >
                                        help@jisc.ac.uk.
                                    </Components.Link>
                                </li>
                                <li className="mb-8">
                                    <span className="font-bold">How do I state affiliations?</span> You may specify the
                                    affiliation(s) related to your publication. This may differ from your current
                                    affiliation, for instance if you&apos;ve moved roles since completing the research
                                    project. Note that Octopus does not display individuals&apos; institutional
                                    affiliation on publication pages.
                                </li>
                            </ul>
                        </StandardText>
                        <Components.PageSubTitle text="Linked publications" />
                        <StandardText>
                            <ul className="ml-8 list-disc">
                                <li className="mb-6">
                                    <span className="font-bold">What is the publication chain?</span> All Octopus
                                    publications are hierarchically linked in a collaborative chain, and each type needs
                                    to be linked to &apos;the one above it in the chain&apos;. This is designed to avoid
                                    vital missing links in the research record. For example, you can&apos;t publish an
                                    Analysis without linking it to the relevant Results, and you can&apos;t publish any
                                    Results without linking that to the Method that you followed. A Review (peer review)
                                    can, of course, be linked to any other type of publication; and a Research Problem
                                    can also arise from any other publication type. You can publish all stages of the
                                    chain (excluding a peer review of your own work!), but any author can also create a
                                    linked publication from another&apos;s work.
                                </li>
                                <li className="mb-8">
                                    <span className="font-bold">
                                        Find the existing publication(s) on Octopus that your publication should link
                                        from.
                                    </span>{' '}
                                    This will be a publication of the appropriate type (i.e. the &apos;one above it in
                                    the chain&apos;). When you view this publication, you will see the option to
                                    &apos;write a linked publication&apos; when you are signed in. You can also click
                                    &apos;Publish&apos; and then search for the publication(s) you want this new work to
                                    be linked from.
                                    <br />
                                    <br />
                                    At launch we will have some seed Research Problems for you to link from, but you may
                                    want to publish a Research Problem specific to your research, and then the
                                    Rationale/Hypothesis etc. However, we recommend searching for existing Research
                                    Problems first. If you are recapping a well-known Research Problem or
                                    Rationale/Hypothesis which is not yet present on the site, then simply treat this
                                    publication as you would the introduction to a paper – giving as good a review of
                                    the literature and history of the ideas as you can, giving credit to those who first
                                    wrote about them.
                                </li>
                            </ul>
                        </StandardText>
                        <Components.PageSubTitle text="Main text" />
                        <StandardText>
                            <ul className="ml-8 list-disc">
                                <li className="mb-6">
                                    <span className="font-bold">How should work be formatted?</span> The publication
                                    process will ask you to enter a title for your new publication, and confirm what
                                    type of publication it is, and it will then give you the option of uploading a .docx
                                    file, or pasting your material directly into a text editor. There are no formatting
                                    requirements in Octopus – you can choose how best to present your work. You should
                                    use the same reporting guidelines that you would when writing a paper, with the
                                    caveat that not all requirements will apply to each of Octopus&apos; smaller
                                    publication types. At the end of the publishing process, you will be able to preview
                                    your publication to make sure all styling, tables and figures etc. are displaying
                                    correctly.
                                </li>
                                <li className="mb-6">
                                    <span className="font-bold">How should references be formatted?</span> You can use
                                    your preferred reference style, but references must be line-separated. Where
                                    appropriate, all references should include a DOI or URL. When adding references,
                                    please separate them from the main text and instead add them to the dedicated
                                    References field. Octopus will then review your references and identify any links –
                                    we recommend checking that these are displaying correctly, and making any edits as
                                    required.
                                </li>
                                <li className="mb-6">
                                    <span className="font-bold">
                                        What about work in other repositories or platforms?
                                    </span>{' '}
                                    Specialist materials cannot be hosted on Octopus, but the platform does allow you to
                                    link to other platforms. Please add the DOIs or URLs to resources hosted elsewhere –
                                    for example, a video protocol, digital images or a large dataset in a specialist
                                    repository. In Octopus you should ensure that there is at least a descriptive
                                    outline of the specialist material you link to, and you may also wish to include
                                    sample data where relevant.
                                </li>
                                <li className="mb-8">
                                    <span className="font-bold">Why do I need a description and keywords?</span> These
                                    are optional fields which aid the discoverability of your work. The text provided
                                    will be used, for instance, when your publication appears in Google results.
                                </li>
                            </ul>
                        </StandardText>
                        <Components.PageSubTitle text="Conflict of interest" />
                        <StandardText>
                            <ul className="ml-8 list-disc">
                                <li className="mb-8">
                                    <span className="font-bold">
                                        What do I need to provide in my conflict of interest statement?
                                    </span>{' '}
                                    You are required to specify where there are any conflicts of interest related to
                                    your publication. If yes, you must provide a short statement on any conflicts of
                                    interest, for example related to your current or past employment, financial
                                    interests, or personal relationships.
                                </li>
                            </ul>
                        </StandardText>
                        <Components.PageSubTitle text="Co-authors" />
                        <StandardText>
                            <ul className="ml-8 list-disc">
                                <li className="mb-8">
                                    <span className="font-bold">How do I list co-authors and institutions?</span> All
                                    authors need to approve a publication before it can go live. Authors will be asked
                                    to provide email addresses for each contributing author. They will receive an email
                                    asking them to confirm their involvement, and providing them with a link to the
                                    draft for review. Co-authors can then approve publication. If any amendments are
                                    required first, these should be raised directly with the submitting author.
                                </li>
                            </ul>
                        </StandardText>
                        <Components.PageSubTitle text="Funders" />
                        <StandardText>
                            <ul className="ml-8 list-disc">
                                <li className="mb-8">
                                    <span className="font-bold">How do I indicate sources of funding?</span> You can
                                    list any sources of funding for your publication. We recommend that where possible
                                    you use your funder&apos;s ROR identifier. This ensures that consistent, accurate
                                    organisational data is displayed and enables more efficient discovery and tracking
                                    of research outputs across institutions and funding bodies. However, if you funding
                                    source does not have a ROR, you can input its details manually. You can also provide
                                    a free-text statement describing the funding arrangements for your publication.
                                </li>
                            </ul>
                        </StandardText>
                        <Components.PageSubTitle text="Research process" />
                        <StandardText>
                            <ul className="ml-8 list-disc">
                                <li className="mb-8">
                                    <span className="font-bold">What other information will I need?</span> Some
                                    publication types require additional information. Results publications require input
                                    on data availability, data permissions, and details of ethical permissions.
                                    Hypotheses and methods have the option to specify if a publication is equivalent to
                                    a &apos;preregistration&apos; (i.e. being published before data has been collected).
                                </li>
                            </ul>
                        </StandardText>
                        <Components.PageSubTitle text="Review and publish" />
                        <StandardText>
                            <ul className="ml-8 list-disc">
                                <li className="mb-6">
                                    <span className="font-bold">Can I preview my publication?</span> Once all required
                                    information has been submitted, you can preview how your publication will look when
                                    published. We recommend that you check through this carefully, as changes cannot be
                                    made post-publication.
                                </li>
                                <li className="mb-6">
                                    <span className="font-bold">What is the acceptance process for publications?</span>{' '}
                                    There is no acceptance or rejection from Octopus – you are recording the work as
                                    yours, and registering when you did so. Others can then assess the work, review it,
                                    and build on it. You should therefore try to ensure that you are completely happy
                                    with the work before you press &apos;publish&apos;. As soon as the last co-author
                                    has agreed it, the work will be live and a DOI available.
                                </li>
                                <li className="mb-6">
                                    <span className="font-bold">What if I made a mistake?</span> Octopus will allow for
                                    reversioning of publications, but this feature is currently under development. When
                                    released, reversioning is intended for cases where an author makes a mistake, or a
                                    reviewer points out something which needs to be added or corrected. In the latter
                                    case, we strongly recommend including the reviewer as a co-author on a new version
                                    to recognise their input. All older versions remain visible on the record, but new
                                    versions have their own DOI. All reviews and red flags remain with the version they
                                    were originally linked to. We recommend keeping reversioning to a minimum.
                                </li>
                            </ul>
                        </StandardText>
                        <StandardText>
                            <>
                                If you require further guidance, or would like to suggest any additional author
                                materials, please contact the team at{' '}
                                <Components.Link
                                    href="mailto:help@jisc.ac.uk"
                                    openNew={true}
                                    className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                >
                                    help@jisc.ac.uk.
                                </Components.Link>
                            </>
                        </StandardText>
                    </div>
                </>
            </PageSection>
        </Layouts.Standard>
    </>
);

export default AuthorGuide;
