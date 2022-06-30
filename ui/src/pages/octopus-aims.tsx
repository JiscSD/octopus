import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';

import parse from 'html-react-parser';

import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Config from '@config';

type ItemProps = {
    header: string;
    content: string;
};

interface JumpTo {
    title: string;
    href: string;
    items: ItemProps[];
}

type SidebarProps = {
    jumpToList: JumpTo[];
};

const AimsData: JumpTo[] = [
    {
        title: 'Sharing Research',
        href: 'SharingResearch',
        items: [
            {
                header: 'Barriers to sharing information quickly',
                content:
                    'Problem: Putting together a traditional research article for publication is resource-intensive and time-consuming, making it difficult to share information quickly.<br /><br /> What Octopus is doing to help: Publication is immediate: as soon as all authors agree on the final wording and layout of their work, it can go live on Octopus. <br /> <br />The modular approach to publication also means that publications are shorter, and do not have to repeat information already published (such as defining the research problem, or stating the protocol by which results were collected). This should all make publishing regularly against a particular research project less time-consuming, and allows researchers to publish as they proceed through every stage.'
            },
            {
                header: 'Cost barriers',
                content:
                    'Problem: Traditional academic publications can be costly (either to the authors or reader) proving a barrier to reading or writing publications for less-well-resourced researchers or those outside of academia. <br /> <br /> What Octopus is doing to help: Octopus is free to use – both to read content and to publish to – and there is no subscription cost for institutions. We have ensured that ongoing operational costs are kept low, including removing costly editorial procedures such as formatting and typesetting, recruitment of peer reviews, editorial staffing etc.'
            },
            {
                header: 'Incentivising all research outputs',
                content:
                    'Problem: Research outputs other than research articles (e.g. analytical code, data, videos, 3D object scans etc) are not being recognised as important outputs and hence researchers are not incentivised to produce them. Some parts of the research process are currently not being shared at all (e.g. full results disclosure, analytical code). Many researchers currently have ‘file drawers’ of small datasets, ideas they have not worked on further etc. which they have not published (because they are not incentivised to do so). This leads to waste of resources as tother researchers are not being able to benefit from and build on this work. <br /> <br /> What Octopus is doing to help: Octopus encourages the publication of smaller pieces of work, which can be judged on their intrinsic qualities (e.g. how well thought-out the idea; how well-collected and reported the data), and not on whether they are currently part of a &apos;complete&apos; chain of research. This means that researchers are now incentivised to share all their best work, based only on its quality and not on its size or whether they&apos;ve carried on working it through to what is traditionally thought of as the &apos;conclusion&apos;. <br /> <br /> ‘Results‘, ‘analysis’ and ‘real-life implementations’ are publication types of their own within Octopus, meaning that the sorts of outputs that often make up these parts of the research process would now be fully recognised on their own and incentivised. Digital-first (or indeed digital-only) publication also means that non-text elements are as simple to share as text. Outputs in other, specialist, repositories can be linked to Octopus publications directly and obviously. The hope is that this means that very varied research outputs will become standard and assessed in the same way as text currently is.'
            },
            {
                header: 'Prioritising reproducibility',
                content:
                    'Problem: Full details of research work are often not being shared enough to allow reproduction of the work, as pressures for &apos;readability&apos; of research articles tends to push word counts down, and the text-based form of traditional publications means that other digital outputs are often not valued and shared. There is also a bias towards positive, headline grabbing results rather than replications or &apos;negative results&apos;. However these have an immense value to the research community and the state of science. <br /> <br />What Octopus is doing to help: Octopus has no word limits, which allows publications to be as long as they need to be to share full details. <br /> <br /> What Octopus is doing to help: Octopus has no word limits, which allows publications to be as long as they need to be to share full details. <br /> <br /> Octopus allows authors to share and get recognition for reproducibility studies and negative results. The emphasis on Octopus is on high-quality outputs at every stage, not creating a particular narrative around the findings. <br /> <br /> In Octopus, every publication has to be linked to an existing one of ‘the type above it’ in the research chain, which means that parts of the research process cannot be missed out or not shared (e.g. someone cannot share data without linking it to the published methodology).'
            }
        ]
    },
    {
        title: 'Addressing Biases',
        href: 'AddressingBiases',
        items: [
            {
                header: '&apos;Positive&apos; findings vs replications or &apos;negative&apos; results',
                content:
                    'Problem: There is a widely-recognised problem with &apos;publication bias&apos;, which means that &apos;positive&apos; findings, or things that are thought to be more exciting to readers are more easily published and few outlets publish replications or &apos;negative results&apos;; and some types of work are much harder to publish than others. <br /> <br /> What Octopus is doing to help: The emphasis on Octopus is on high-quality outputs at every stage, not creating a particular narrative around the findings. Octopus removes editorial gatekeepers which means that there are no artificial barriers to publishing work - and what is incentivised are indicators of good quality/best practice in the research process, rather than any feature of the &apos;findings&apos; or &apos;impact&apos;. This allows the publication of all types of work, whatever the topic or result.'
            },
            {
                header: 'Institutional bias',
                content:
                    'Problem: These is a recognised publication bias in favour of academic work done within higher education institutions, and much research work done outside of these is not shared in the same way since traditional articles are very time-consuming to write and there is little incentive to spend resources unless an author &apos;needs&apos; a publication for their career. Research not shared is often repeated or not learned from by others. <br /> <br />What Octopus is doing to help: On Octopus sharing work is quicker, easier, and carries no financial burden, reducing the &apos;publishing overhead&apos;. Those not in academia (i.e. practitioners and commercial researchers) and those with less access to funding are better able to share their work. This leads to less of a divide between academic and &apos;grey&apos; literature.'
            },
            {
                header: 'The influence of &apos;impact&apos; on research topic',
                content:
                    'Problem: There is currently a bias in the choice of research topics by researchers based on those prioritised by &apos;high impact publications&apos; meaning that many topics get less attention.<br /> <br /> What Octopus is doing to help: The removal of &apos;impact&apos; as a basis for judging quality removes this bias: good quality work is good quality work regardless of field or topic (or the research stage featured in the publication).'
            },
            {
                header: 'Publication language',
                content:
                    'Problem: The majority of traditional publishers publish English-language content only, meaning there are high barriers to publication or reading research for non-native English speakers. <br /><br /> What Octopus is doing to help: Authors can publish in any language and users can filter search results by language. When the reversioning feature is released, authors will also have the option to publish multiple versions in different languages. <br /> <br />We are also hoping to integrate an automated translation tool which would deliver high-quality translations of academic works. This would allow the platform to be truly language-agnostic, so that everyone can seamlessly read and write in their own native language. This is a high priority feature for us and we hope to have it in place soon. This is a high priority feature for us, and we will be investigating options to take forward.'
            },
            {
                header: 'Real World Application',
                content:
                    'Problem: There is a lack of emphasis on real world implementation in the current publication process, leading to too much &apos;theoretical&apos; work and not enough &apos;useful&apos; work being shared. <br /> <br /> What Octopus is doing to help: In Octopus, real world implementation ideas are a publication type of their own, focussing researchers&apos; efforts on these in their own right, and not – as is often the case at the moment - an add-on few sentences at the end of a traditional research article. It also allows much more research on and understanding of how generalisable many findings and techniques developed through research really are.'
            }
        ]
    },
    {
        title: 'Research Quality',
        href: 'ResearchQuality',
        items: [
            {
                header: 'Questionable research practices',
                content:
                    'Problem: Questionable research practices such as p-hacking, HARK-ing and cherry-picking of results. <br /> <br /> What Octopus is doing to help: Most questionable research practices happen because researchers are trying to make their work &apos;more publishable&apos; and so make their results look &apos;positive&apos; and more impactful. In order to remove that pressure, Octopus no longer values research on the basis of the findings, but on the intrinsic quality of how it was done, and it also removes the narrative element from publications by breaking publications up into smaller pieces, so that hypotheses and data are no longer judged on how they relate to each other, but instead on the intrinsic qualities of each individually. Octopus also has a tick-box to indicate when a piece of work has been published before the &apos;next stage&apos; has been attempted (the equivalent of preregistration of a hypothesis or protocol).'
            },
            {
                header: 'Peer review',
                content:
                    "Problem: Peer review in the traditional publication process doesn't take place until all the work is complete and an article is drafted, often at the end of the research project, meaning that flaws in the research process are not picked up and researchers are forced into a defensive position as they have already put a lot of resources into the project. <br /> <br />What Octopus is doing to help: Research work in Octopus is published – and hence peer reviewed - in smaller units, and best practice will be to build only on work that has already been published and peer reviewed, meaning that data is only collected according to protocols that have been reviewed and deemed a good design etc. This means that researchers can be more confident that their work is always of high quality and worthwhile, and that peer review is a helpful and collaborative process rather than a difficult judgement on the worthiness of a long period of solitary research."
            },
            {
                header: 'Transparent correction of mistakes',
                content:
                    'Problem: There is currently no real way to &apos;correct&apos; the scientific record, as retractions are rare, slow and problematic even when they occur. What Octopus is doing to help: In Octopus, ‘red flagging’ allows easy warnings to be raised over publications, and reversioning will allow open and transparent correction of mistakes without the possibility of future readers missing that a new version has been created.'
            }
        ]
    },
    {
        title: 'Research Culture',
        href: 'ResearchCulture',
        items: [
            {
                header: 'Transparent correction of mistakes',
                content:
                    'Problem: There are currently hierarchical problems in the research culture, based around access and &apos;success&apos; in the publication system. Where there is a strong hierarchy, there is the potential for bullying practices or pressures to perform questionable research practices. <br /> <br />What Octopus is doing to help: Octopus removes human gatekeepers to publishing work (e.g. editors or single-blind peer review) where &apos;who you know&apos; can become important. It also makes it easier to produce single-author publications, meaning that junior researchers can publish even without the weight of a senior author behind them.'
            },
            {
                header: 'Sustainable peer review',
                content:
                    'Problem: The current peer review system is unsustainable and already under great strain due to the ever-increasing numbers of publications (since quantity of publications is incentivised), all needing 2+ reviewers. <br /> <br />What Octopus is doing to help: Firstly, Octopus is designed to reduce the pressures for authors to publish a high volume of output in favour of assessing quality of outputs better, meaning that authors are incentivised to produce fewer but better publications. Secondly, making peer review an open and rewarded (as well as assessed) skill so that researchers have an incentive to write reviews (and to review well rather than just often) and see it as part of their work rather than an unrecognised adjunct to it.'
            },
            {
                header: 'Accountability',
                content:
                    'Problem: There are currently problems of accountability for poor work (or even misconduct) in one part of a research process (e.g. falsification of results, poor analysis, image manipulation), since it is all written up together into a single article with multiple authors. It is then not clear who is responsible for the integrity of each part of the article. <br /> <br /> What Octopus is doing to help: The smaller author groups and smaller publication units within Octopus increase both the accountability and meritocracy of the research process - it&apos;s easier to see exactly who&apos;s done what.'
            },
            {
                header: 'Tracking misconduct',
                content:
                    'Problem: It is difficult to track &apos;repeat offenders&apos; for research misconduct. <br /> <br />What Octopus is doing to help: In Octopus, &apos;red flags&apos; will be visible on an author&apos;s page and on publication pages. This ensures that red flags are prominent, but the full detail of the conversation between the author and flagger will allow users to use their judgement on whether the red flags represent real concerns or not.'
            },
            {
                header: 'A more collaborative research culture',
                content:
                    'Problem: Researchers are much more competitive than collaborative with each other, and fearful of sharing ideas because of the concern of being &apos;scooped&apos;.<br /> <br /> What Octopus is doing to help: Octopus is designed to change the emphasis of research so that &apos;findings&apos; are no longer the main aim; instead we want to support quality at every stage of the research process. <br /> <br /> Shifting the focus from the narrative emphasis of the traditional article, Octopus is designed to support quality at every stage of the research process. &apos;Findings&apos; are no longer the main aim, there is no pressure to &apos;prove a hypothesis&apos;, only to come up with a good one and share it with the community. <br /> <br /> Octopus allows researchers to see their work as a piece in a bigger jigsaw picture – that everyone is working around the world, and through time, to build a picture of how the world works, and that an individual researchers&apos; job is to ensure that each piece they contribute to that picture is as high quality as it can be. The publication of each &apos;piece&apos;, rather than trying to contribute whole pictures of one&apos;s own, should change the way that people see the research process, and behave within it. We hope that incentivising and positioning reviewing as a scientific skill like any other can help us set a good example and standard of what good, constructive critique looks like. <br /> <br /> Plus, once it&apos;s published in Octopus it is time-stamped and registered to the authors. By acting as a public registry for ideas and for work, Octopus aims to remove the fear of &apos;scooping&apos; and in fact to encourage people to record their ideas in it to protect themselves from it.'
            }
        ]
    },
    {
        title: 'Fair credit',
        href: 'FairCredit',
        items: [
            {
                header: 'More meaningful author groups',
                content:
                    'Problem: Traditional research articles often have large author groups which do not accurately reflect who does what, which can be especially problematic for junior or specialist researchers (e.g. analysts, technicians).<br /><br /> What Octopus is doing to help: smaller publications encourage smaller author groups that more accurately reflect the work done at each stage, leading to more meritocratic recognition, especially for specialists (see below)'
            },
            {
                header: 'Recognition for specialists',
                content:
                    'Problem: There is a lack of recognition for specialists, and unspecialised researchers are incentivised to complete some aspects of a research chain which they are not trained to do (e.g. statistical analysis, code-writing, qualitative analysis) in order to be able to complete a full research article for publication. <br /><br /> What Octopus is doing to help: In Octopus, the publication of smaller units of research work means that specialists can now publish their own work, or publish in smaller author groups, with different groups potentially working at each stage to form a collaborative whole. This can allow more specific recognition for individuals&apos; work and specialities. Over time, an author&apos;s Octopus profile page will build a picture of the kind of work they publish (e.g. they publish mainly hypotheses – they&apos;re an &apos;ideas person&apos;; or they publish mainly protocols – they&apos;re a &Apos;design person&apos;; or they publish mainly analyses etc). Because each stage of work is judged on its own merits, researchers should feel less compelled to produce all stages of the research process.'
            },
            {
                header: 'Proxy metrics and &apos;impact&apos;',
                content:
                    'Problem: The only metrics to judge quality, of both research and researchers, at the moment are poor proxies such as H-index and Journal Impact Factors, leading to perverse incentive structures. <br /> <br /> What Octopus is doing to help: We want to move away from poor proxy metrics of value and impact. Currently the red flag process allows users to quickly indicate a serious issue with a publication, which the author can then address. Longer-term, we are working to ensuring the value and quality of Octopus publications by exploring different approaches to assessment with the research community, such as additional community moderation features, which will allow users to rate or recommend content. We can also explore integrations with automatic plagiarism detection software including inbuilt image manipulation detection.'
            },
            {
                header: 'Copyright',
                content:
                    'Problem: Authors often have to sign over copyright when publishing their work. <br /> <br />What Octopus is doing to help: Octopus is not a &apos;publisher&apos; and authors stay in control of their own copyright, choosing a Creative Commons copyright license. Our only requirements are that the work is published open access, and that it allows derivative works (so that we can include it in upcoming features like translation).'
            }
        ]
    },
    {
        title: 'Finding relevant research',
        href: 'FindingRelaventResearch',
        items: [
            {
                header: 'Finding research',
                content:
                    'Problem: There is a huge volume of traditional publications, in different journals, making it very difficult to find relevant quality research. <br /> <br /> What Octopus is doing to help: Each Octopus publication must be linked to at least one other, creating a network of branching chains. These chains each start with a &apos;Problem&apos;, providing a structure to the content on the site and making it easy to find content related to a certain research problem. <br /> <br /> We will shortly release a feature which allows researchers to subscribe to publications and so receive notifications of newly published work linked, for instance, to a particular research problem or dataset.'
            },
            {
                header: 'Cross- and multi-disciplinary work',
                content:
                    'Problem: There are currently silos and divides between research fields as researchers tend to work in particular groups and publish in certain journals. <br /> <br /> What Octopus is doing to help: There are no disciplinary categories in Octopus. Instead, all research being published in one place and linked to other publications. Readers can also add relevant cross-links, regardless of discipline. For example, a reader could cross-link a publication created under a Problem in one field with a publication liked under a completely different Problem, in what would traditionally be recognised as another field. This will hopefully build bridges between traditional silos and recognise cross and multi-disciplinary work'
            }
        ]
    }
];

const CategorySidebar: React.FC<SidebarProps> = (props): JSX.Element => (
    <div className="sticky top-16 space-y-2 border-l border-l-teal-200 pl-4">
        {props.jumpToList.map((jumpTo: JumpTo) => (
            <a
                key={jumpTo.href}
                href={`#${jumpTo.href}`}
                className="mb-0.5 block w-fit rounded border-transparent py-0.5 text-sm text-grey-800 outline-0 transition-colors duration-500 hover:text-teal-400 hover:underline focus:ring-2 focus:ring-yellow-400 dark:text-grey-100"
            >
                {jumpTo.title}
            </a>
        ))}
    </div>
);

const OctopusAims: NextPage = (): React.ReactElement => (
    <>
        <Head>
            <meta name="description" content={Config.urls.octopusAims.description} />
            <meta name="keywords" content={Config.urls.octopusAims.keywords.join(', ')} />
            <link rel="canonical" href={Config.urls.octopusAims.canonical} />
            <title>{Config.urls.octopusAims.title}</title>
        </Head>

        <Layouts.Standard fixedHeader={false}>
            <section className="container mx-auto px-8 pb-10 pt-10 lg:gap-4 lg:pt-20">
                <Components.PageTitle text="Octopus in detail: aims and priorities" />
                <span className="my-6 mx-auto flex  space-x-1 font-montserrat text-xl font-normal text-grey-800 transition-colors duration-500 dark:text-white-100">
                    Octopus is designed to change the incentive structure within the research community to ensure that
                    what is recognised, rewarded, encouraged is what will best drive research in the &apos;right&apos;
                    direction. Here&apos;s we&apos;ve provided more information on each of the issues Octopus is
                    actively trying to help solve:
                </span>
            </section>

            <section className="container mx-auto grid grid-cols-1 px-8 lg:grid-cols-8 lg:gap-16">
                <aside className="col-span-2 pt-2 lg:block">
                    <CategorySidebar jumpToList={AimsData} />
                </aside>
                <div className="pt-14 lg:col-span-6 lg:pt-0">
                    {AimsData.map((content) => (
                        <div key={content.href} id={content.href} className="mx-auto lg:w-10/12">
                            <>
                                <h2 className="my-8 flex space-x-1 font-montserrat text-3xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-100">
                                    {content.title}
                                </h2>
                                {content.items.map((item: ItemProps, index: number) => (
                                    <div key={index}>
                                        <dl>
                                            <dt className="my-6 flex space-x-1 font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-100">
                                                {parse(item.header)}
                                            </dt>
                                            <dd className="mb-0.5 block w-fit rounded border-transparent py-0.5 text-sm text-grey-800 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-grey-100">
                                                {parse(item.content)}
                                            </dd>
                                        </dl>
                                    </div>
                                ))}
                            </>
                        </div>
                    ))}
                </div>
            </section>
        </Layouts.Standard>
    </>
);

export default OctopusAims;
