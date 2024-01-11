import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import * as Framer from 'framer-motion';

import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Config from '@config';

type PageSectionProps = {
    children: React.ReactNode;
};

type TextProps = {
    children: React.ReactNode;
};

type AuthorGuideSection = {
    title: string;
    id: string;
    content: React.ReactNode;
};

const PageSection: React.FC<PageSectionProps> = (props): React.ReactElement => {
    return (
        <Framer.motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring' }}
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

const authorGuideSections: AuthorGuideSection[] = [
    {
        title: 'Overview',
        id: 'overview',
        content: (
            <>
                <p className="mb-2">
                    Octopus publications are different to traditional journal articles or papers. There are eight
                    smaller publication types aligned with the research process. A little like a &apos;patent
                    office&apos;, you can register all your work, including theories, data, and analyses. However, when
                    you start the publication process you’ll need to approach it as though you’re submitting to a
                    journal. Whatever you publish should be the formal &apos;version of record&apos;, ready to be
                    assessed by others and publicly recorded against your name and{' '}
                    <a href="https://orcid.org/" target="_blank" className="underline">
                        ORCID iD
                    </a>
                    . You might want to have a look at some example publications of the different types before writing
                    your own.{' '}
                    <a href="https://www.octopus.ac/faq#pub_type_octopus" target="_blank" className="underline">
                        Here
                    </a>{' '}
                    is a handy guide to the eight types. It is most likely that your first publication will be of a
                    Research Problem.{' '}
                    <a
                        href="https://www.octopus.ac/publications/gv8n-ap77/versions/latest"
                        target="_blank"
                        className="underline"
                    >
                        Here
                    </a>{' '}
                    is an example of what a Research Problem publication might look like. You can also see other
                    publication types linked to that one. When you&apos;re ready to publish, you will need to have to
                    hand:
                </p>
                <ul className="list-disc">
                    <li>Your publication title</li>
                    <li>Your main publication text and references</li>
                    <li>The email addresses of any co-authors</li>
                    <li>Information about any funders that should be acknowledged</li>
                    <li>Details of any conflicts of interest to be declared for all authors</li>
                    <li>
                        Your institutional affiliation(s), to make it easier for your work to be tracked and deposited
                        in the correct repositories
                    </li>
                    <li>
                        A publication or topic already on Octopus to link yours to. If you’re publishing a Research
                        Problem this could be a generic topic, such as ‘medicine’, though the more specific the better
                        as it will help your publication be found and assimilated with other research on the topic.
                    </li>
                </ul>
                <p className="mb-2">
                    If you require further guidance, or would like to suggest any additional author materials, please
                    contact the team at help@jisc.ac.uk.
                </p>
                <p>
                    <b>
                        Publishing on Octopus is quick and easy by design. Below is a step-by-step guide to get you
                        started.
                    </b>
                </p>
            </>
        )
    },
    {
        title: 'Signing in',
        id: 'signing-in',
        content: (
            <p>
                You’ll sign in using your ORCID® credentials (or create an ORCID account if you don&apos;t have one).
                You will also need to provide a verified email address so that you can receive essential service
                notifications.
            </p>
        )
    },
    {
        title: 'Publication types',
        id: 'publication-types',
        content: (
            <p>
                The eight publication types in Octopus are intended to align with the research process, so select the
                stage which matches where you are in your work.{' '}
                <a href="/faq" target="_blank" className="underline">
                    See our FAQ
                </a>{' '}
                for more information on the publication types. You can publish each stage as it happens, publish when
                the project is finished, or adapt existing papers to record prior work to Octopus.
            </p>
        )
    },
    {
        title: 'Adding a publication',
        id: 'adding-a-publication',
        content: (
            <>
                <p className="mb-2">
                    Click &apos;Publish&apos; on the navigation bar. Alternatively, you have the option to &apos;write a
                    linked publication&apos; or to &apos;write a review&apos; on any publication page. You’ll be
                    prompted to add a title and select the publication type. If you’re writing a review or linked
                    publication, the publication type will be automatically limited to available options. Note that
                    publication type cannot be changed once a draft is created.
                </p>
                <p className="mb-2">
                    Once you click &apos;Create this publication&apos;, a draft is created. You’ll be taken to the full
                    publication form, here you can navigate to any page of the publication process. The review page will
                    show you any missing required information. Once all essential information is provided, you can
                    preview and publish your work.
                </p>
                <p>All publications on the platform use a CC-BY 4.0 licence to comply with open access requirements.</p>
            </>
        )
    },
    {
        title: 'Affiliations',
        id: 'affiliations',
        content: (
            <p>
                You may specify the affiliation(s) related to your publication. These are pulled in from your ORCID
                profile, so you’ll need to make sure you have the necessary information filled out there to add it. The
                affiliation for your work may differ from your current affiliation, for instance if you&apos;ve moved
                roles since completing the research project. Octopus does not display individuals&apos; institutional
                affiliation on publication pages.
            </p>
        )
    },
    {
        title: 'Linked publications',
        id: 'linked-publications',
        content: (
            <>
                <p className="mb-2">
                    All Octopus publications are hierarchically linked in a collaborative chain and need to be connected
                    to &apos;the one above it in the chain&apos;. This is designed to avoid vital missing links in the
                    research record. For example, you can&apos;t publish an ‘analysis’ without linking it to the
                    relevant ‘results’, and you can&apos;t publish any ‘results’ without linking that to the ‘method’
                    that you followed. A ‘peer review’ can be linked to any other type of publication; and a ‘research
                    problem’ can also arise from any other publication type. You can publish all stages of the chain
                    (excluding a peer review of your own work!), but any author can also create a linked publication
                    from another&apos;s work.
                </p>
                <p className="mb-2">
                    To link your work, find the existing publication(s) on Octopus. This will be a publication of the
                    appropriate type (i.e. the &apos;one above it in the chain&apos;). When you view this publication,
                    you’ll see the option to &apos;write a linked publication&apos; if you’re signed in. You can also
                    click &apos;Publish&apos; and then search for the publication(s) you want this new work to be linked
                    from.
                </p>
                <p>
                    We recommend linking your work to existing publications on Octopus. If you can’t find an existing
                    piece of work that yours stems from in some manner, you can always find the relevant topic and link
                    it to that instead. However, we recommend searching for existing Research Problems first. If you are
                    recapping a well-known Research Problem or Rationale/Hypothesis which is not yet present on the
                    site, simply treat this publication as you would the introduction to a paper.
                </p>
            </>
        )
    },
    {
        title: 'Main text',
        id: 'main-text',
        content: (
            <p>
                To add your main text you have the option of uploading a .docx file, or pasting your work directly into
                a text editor. There are no formatting requirements in Octopus – you can choose how best to present your
                work. You should use the same reporting guidelines that you would when writing a paper, with the caveat
                that not all requirements will apply to each of Octopus&apos; smaller publication types. At the end of
                the publishing process, you will be able to preview your publication to make sure all styling, tables
                and figures etc. are displaying correctly.
            </p>
        )
    },
    {
        title: 'Adding references',
        id: 'adding-references',
        content: (
            <p>
                You can use your preferred reference style, but references must be line-separated. Where appropriate,
                all references should include a DOI or URL. You’ll need to separate your references from the main text
                and instead add them to the dedicated ‘References’ field. Octopus will review your references and
                identify any links – we recommend checking that these are displaying correctly, and making any edits as
                required.
            </p>
        )
    },
    {
        title: 'Referencing work in other repositories',
        id: 'referencing-work-in-other-repositories',
        content: (
            <p>
                Specialist materials cannot be hosted on Octopus, but the platform does allow you to link to other
                platforms. You’ll need to add the DOIs or URLs to resources hosted elsewhere – for example, a video
                protocol, digital images or a large dataset in a specialist repository. In Octopus you should ensure
                that there is at least a descriptive outline of the specialist material you link to, and you may also
                wish to include sample data where relevant.
            </p>
        )
    },
    {
        title: 'Description/keywords',
        id: 'description-and-keywords',
        content: (
            <p>
                These are optional fields which aid the discoverability of your work. The text provided will be used,
                for instance, when your publication appears in Google results.
            </p>
        )
    },
    {
        title: 'Conflict of interest',
        id: 'conflict-of-interest',
        content: (
            <p>
                Before publishing, you’ll need to specify where there are any conflicts of interest related to your
                publication. If yes, you must provide a short statement on any conflicts of interest, for example
                related to your current or past employment, financial interests, or personal relationships.
            </p>
        )
    },
    {
        title: 'Funders',
        id: 'funders',
        content: (
            <p>
                You can list any sources of funding for your publication. We recommend that where possible you use your
                funder&apos;s ROR identifier to ensure consistent and accurate organisational data is displayed. This
                will also enable more efficient discovery and tracking of research outputs across institutions and
                funding bodies. However, if your funding source does not have a ROR, you can input details manually. You
                can also provide a free-text statement describing the funding arrangements for your publication.
            </p>
        )
    },
    {
        title: 'Research process',
        id: 'research-process',
        content: (
            <p>
                Some publication types require additional information. Results publications require input on data
                availability, data permissions, and details of ethical permissions. Hypotheses and methods have the
                option to specify if a publication is equivalent to a &apos;preregistration&apos; (i.e. being published
                before data has been collected).
            </p>
        )
    },
    {
        title: 'Co-authors',
        id: 'co-authors',
        content: (
            <p>
                All authors need to approve a publication before it can go live. Authors will be asked to provide email
                addresses for each contributing author. They’ll receive an email asking them to confirm their
                involvement, providing them with a link to the draft for review. Co-authors will need to add their
                affiliations, and then are able to approve the publication. If any amendments are required first, these
                should be raised directly with the submitting author.
            </p>
        )
    },
    {
        title: 'Previewing publications',
        id: 'previewing-publications',
        content: (
            <p>
                Once all required information has been submitted, you can preview your publication. We recommend that
                you check through this carefully, as changes cannot be made to this version of work post-publication.
            </p>
        )
    },
    {
        title: 'Acceptance process',
        id: 'acceptance-process',
        content: (
            <p>
                There’s no acceptance or rejection from Octopus, you’re recording the work as yours, and registering
                when you did so. Others can then assess the work, review it, and build on it. You should try to ensure
                that you are completely happy with the work before you press &apos;publish&apos;.
            </p>
        )
    },
    {
        title: 'Reversioning',
        id: 'reversioning',
        content: (
            <p>
                Octopus allows for reversioning of publications. This feature is intended for cases where an author
                makes a mistake, or a reviewer points out something which needs adding or correcting. In the latter
                case, we recommend including the reviewer as a co-author on a new version to recognise their input.
            </p>
        )
    },
    {
        title: 'Creating a new version',
        id: 'creating-a-new-version',
        content: (
            <>
                <p className="mb-2">
                    To reversion your work, you’ll have the option to create a new draft from the publication page. You
                    can also access this link from your account page. Once you’ve selected ‘create a new draft’, you can
                    go through the publishing process in the same way as you would with any other publication in
                    Octopus. All co-authors will need to approve the new version of work before publishing.
                </p>
                <p className="mb-2">
                    Once your new version is published, a dropdown menu will be available on the publication page so
                    readers can choose which version of work to view. Each new version will have its own DOI and any
                    peer reviews or red flags will remain with the version they were originally linked to. A canonical
                    DOI is also available which will always point to the latest version of a publication.
                </p>
            </>
        )
    }
];

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
                <div className="container mx-auto px-8 pb-10 pt-10 lg:gap-4 lg:pt-20">
                    <Components.PageTitle text="Author guide to publishing on Octopus." />
                </div>
                <div className="container mx-auto grid grid-cols-1 px-8 lg:grid-cols-8 lg:gap-16">
                    <aside className="col-span-2 pt-2 lg:block">
                        <Components.PageContentsSidebar
                            jumpToList={authorGuideSections.map(({ title, id }) => ({ href: id, title }))}
                        />
                    </aside>
                    <div className="pt-14 lg:col-span-6 lg:pt-0">
                        {authorGuideSections.map((authorGuideSection) => (
                            <div
                                key={authorGuideSection.id}
                                id={authorGuideSection.id}
                                className="mx-auto pt-4 lg:w-10/12"
                            >
                                <dl>
                                    <dt>
                                        <Components.PublicationCreationStepTitle text={authorGuideSection.title} />
                                    </dt>
                                    <dd className="mb-14 pt-2 text-sm leading-6 text-grey-600 transition-colors duration-500 dark:text-grey-200">
                                        {authorGuideSection.content}
                                    </dd>
                                </dl>
                            </div>
                        ))}
                    </div>
                </div>{' '}
            </PageSection>
        </Layouts.Standard>
    </>
);

export default AuthorGuide;
