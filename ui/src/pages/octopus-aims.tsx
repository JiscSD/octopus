import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';

import parse from 'html-react-parser';

import * as Components from '@/components';
import * as Layouts from '@/layouts';
import * as Config from '@/config';

type ItemProps = {
    header: string;
    content: {
        problem: string;
        help: string;
    };
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
                content: {
                    problem:
                        'Putting together a traditional research article for publication is resource-intensive and time-consuming, making it difficult to share information quickly. This also means researchers are nervous of others &apos;scooping&apos; them until they have published their work.',
                    help: 'Publication is immediate: as soon as all authors agree on the final wording and layout of their work, it can go live on Octopus. This means that researchers can quickly get recognition (a DoI and &apos;time stamp&apos; to assert priority) on their ideas and their work.<br/><br/>The modular approach to publication also means that publications are shorter, and do not have to repeat information already published (such as defining the research problem, or summarising previous approaches to it). This should make publishing less time-consuming, and allows researchers to publish regularly as they proceed through every stage of a research project if they want (asserting their ownership of the work at every stage).'
                }
            },
            {
                header: 'Cost barriers',
                content: {
                    problem:
                        'Traditional academic publications can be costly (either to the authors or reader) proving a barrier to reading or writing publications, particularly for less-well-resourced researchers or those outside of academia.',
                    help: 'Octopus is free to use – both to read and to publish to – and there is no subscription cost for institutions. We have ensured that ongoing operational costs are kept low, including removing costly editorial procedures such as formatting and typesetting, recruitment of peer reviews, editorial staffing etc. This should help minimise barriers to publication and help remove hierarchies created by &apos;gatekeepers&apos; to the publication record.'
                }
            },
            {
                header: 'Incentivising all research outputs',
                content: {
                    problem:
                        'Research outputs other than research articles, monographs and books are not given enough recognition as important outputs in the traditional incentive system. Some parts of the research process are currently not being shared at all (e.g. full results disclosure, analytical code, creative works). Many researchers also currently have &apos;file drawers&apos; of small datasets, ideas they have not worked on further etc. which they have not published, because they are not incentivised to do so. This leads to waste of resources as other researchers are not being able to benefit from and build on this work.',
                    help: 'Octopus encourages the publication of all pieces of work, which can be judged on their intrinsic qualities (e.g. how well thought-out the idea; how well-collected and reported the data), and not on whether they are currently part of a &apos;complete&apos; chain of research. This means that through Octopus, researchers are incentivised to share all their best work, which will be assessed only on its quality and not on its size or whether they&apos;ve carried on working it through to what is traditionally thought of as the &apos;conclusion&apos;.<br/><br/>&apos;Data&apos;, &apos;analysis&apos; and &apos;implications/applications&apos; are publication types of their own within Octopus, meaning that the sorts of outputs that often make up these parts of the research process can now be fully recognised on their own and incentivised. Digital-first (or indeed digital-only) publication also means that digital objects (such as code, data, video, images) are as simple to share as text. Outputs in specialist repositories can be linked to Octopus publications directly and obviously. This facilitates the assessment and rewarding of such outputs during research assessment exercises (such as hiring, promotion and national exercises such as the REF in the UK).'
                }
            },
            {
                header: 'Prioritising reproducibility',
                content: {
                    problem:
                        'Full details of research work are often not being shared enough to allow reproduction or full quality assessment of the work. Pressures for &apos;readability&apos; of traditional scholarly outputs tends to push word counts down, and the text-based form of these legacy publications means that other forms of digital outputs (often vital for true assessment or reproduction of the work) are often not shared and hence assessed or valued.',
                    help: 'Octopus has no word limits, which allows publications to be as long as they need to be to share full details. It is also digital-first, meaning that any digital object can be included (via a URL or DoI) in an Octopus publication.<br/><br/>Octopus allows authors to share and get recognition for any kind of work. The sharing and assessment of smaller units of work also removes the emphasis on the &apos;findings&apos; that is inherent in the assessment of traditional narrative outputs such as papers and monographs. Instead, each piece of work can be assessed on its intrinsic quality, which will include how well and fully it is explained. The intrinsic quality of a method will be high when it is both well designed to address the research question and fully enough detailed that the reader knows exactly how it is carried out.<br/><br/>Additionally, in Octopus, every publication has to be linked to an existing one of &apos;the type above it&apos; in the research chain, which means that parts of the research process cannot be missed out or not shared (e.g. a researcher cannot share data without linking it to the published methodology).'
                }
            }
        ]
    },
    {
        title: 'Addressing Biases',
        href: 'AddressingBiases',
        items: [
            {
                header: '&apos;Positive&apos; findings vs replications or &apos;negative&apos; results',
                content: {
                    problem:
                        'There is a bias in traditional scholarly publishing towards so-called &apos;positive&apos; results (those which might imply a need for change in understanding, policy or practice) rather than replications re-affirming previous findings or so-called &apos;negative results&apos;. (where findings turn out not to support an idea or hypothesis). However, all these findings are equally important to the research community.',
                    help: 'Octopus removes editorial gatekeepers which means that there are no artificial barriers or gatekeepers, to publishing work. This means that we can instead incentivise the sharing of all work through assessment based on indicators of good quality/best practice in the research process, rather than any feature of the &apos;findings&apos; or &apos;impact&apos;. The emphasis on Octopus is therefore on high-quality outputs at every stage, not creating a particular narrative around the findings.'
                }
            },
            {
                header: 'Institutional bias',
                content: {
                    problem:
                        'There is a recognised publication bias in favour of academic work done within higher education institutions, and assessments of the quality of work is often biassed by the reputation of the institution the authors are affiliated with. On top of that, much research work done outside of academia is not shared in the same way since traditional articles are very time-consuming to write and there is little incentive to spend resources unless an author &apos;needs&apos; a publication for their career. Research not shared is often repeated or not learned from by others, creating more waste.',
                    help: 'With Octopus, sharing work is quicker, easier, and carries no financial burden, reducing the &apos;publishing overhead&apos;. Those not in academia (e.g. practitioners, researchers in industry, government or NGOs) and those with less access to funding are better able to share their work. This leads to less of a divide between academic and &apos;grey&apos; literature.<br/><br/>When work is published on Octopus, the authors&apos; institutional affiliations are not immediately viewable (it requires clicking on an author&apos;s name), meaning that readers are not unintentionally biased in their assessment of the work by seeing the institutional names at the top of a publication.'
                }
            },
            {
                header: 'The influence of &apos;impact&apos; on research topic',
                content: {
                    problem:
                        'There is currently a bias in the choice of research topics by researchers based on those prioritised by &apos;high impact publications&apos; meaning that many topics get less attention (often those with less generalisable findings, and hence less general readership interest).',
                    help: 'The removal of &apos;impact&apos; as a basis for judging quality removes this bias: good quality work is good quality work regardless of field or topic (or the research stage featured in the publication).'
                }
            },
            {
                header: 'Real World Applications',
                content: {
                    problem:
                        'There is a lack of emphasis on real-world implementation and publication of specific case studies in the current publication process, as these are not deemed &apos;high impact&apos;.',
                    help: 'The fact that &apos;implications/applications&apos; are a publication type in their own right in Octopus incentivises the publication of real-world implementation case studies. These are vital for others to learn from. It also allows much more research on, and understanding of, how generalisable many findings and techniques developed through research really are.'
                }
            },
            {
                header: 'Publication language',
                content: {
                    problem:
                        'The majority of traditional publishers publish English-language content only, meaning there are high barriers to publication or reading research for non-native English speakers.',
                    help: 'Authors can publish in any language and users can filter search results by language.<br/><br/>When authors set the language of their publication, the page displaying it will signal to web browsers, allowing readers to select automatic language translation where their browser allows it. This is part of our aim to make the platform to be truly language-agnostic, so that everyone can seamlessly read and write in their own native language.'
                }
            }
        ]
    },
    {
        title: 'Research Quality',
        href: 'ResearchQuality',
        items: [
            {
                header: 'Questionable research practices',
                content: {
                    problem:
                        'Questionable research practices such as p-hacking, HARK-ing and cherry-picking of results which all lead to inaccurate information in the research record.',
                    help: 'Most questionable research practices happen because researchers are trying to make their work &apos;more publishable&apos; and so make their results look &apos;positive&apos; and more impactful. In order to remove that pressure, Octopus does not value research on the basis of the findings, but on its intrinsic quality: how well the work was done and shared. It also removes the narrative element from publications by breaking publications up into smaller pieces, so that hypotheses and results are no longer judged on how they relate to each other, but instead on the intrinsic qualities of each individually. Octopus also has a tick-box to indicate when a piece of work has been published before the &apos;next stage&apos; has been attempted (the equivalent of preregistration of a hypothesis or protocol).'
                }
            },
            {
                header: 'Peer review',
                content: {
                    problem:
                        'Peer review in the traditional publication process doesn&apos;t take place until all the work is complete and an article is drafted, often at the end of the research project, meaning that flaws in the research process are not picked up and researchers are forced into a defensive position against peer reviewers as they have already put a lot of resources into the project and &apos;need&apos; to get it published.',
                    help: 'Research work in Octopus is published before peer review, removing the &apos;gatekeeper&apos; role of peer review and changing the relationship between reader, author, and peer reviewer. Because publication is also in smaller units, and can be done &apos;before the next stage of the research is completed&apos;, peer review takes on a very different role. Peer reviewers are now not blockers to publication, but potential assistants to make work more robust and better inform next stages of a project. Best scientific practice can evolve to build only on work that has already been published and peer reviewed, meaning that data is only collected according to protocols that have been reviewed and deemed a good design etc. Peer review in stages means that researchers can be more confident that their work is always of high quality and worthwhile. Readers, meanwhile, can read peer reviews alongside the work, gaining a more nuanced understanding of its strengths and weaknesses than a binary and opaque &apos;peer reviewed or not&apos; judgement.<br/><br/>Peer reviews are a publication type in their own right – all are named and visible. This incentivises good peer reviewing, as they will be part of the review authors&apos; profile. However, because reviews are of smaller publication units than the traditional &apos;paper&apos; or &apos;monograph&apos; – for example, of an idea, or an analysis – they will be quicker to write, and more specific, meaning that peer reviewers that choose to write a review of that publication are more likely to be experts in that specific element, and scrutinise it closely.'
                }
            },
            {
                header: 'Transparent correction of mistakes',
                content: {
                    problem:
                        'There is currently no real way to &apos;correct&apos; the scientific record, as retractions are rare, slow and problematic even when they occur.',
                    help: 'In Octopus, &apos;red flagging&apos; allows easy warnings to be raised over publications. These – and the reasons given for the flag being raised – will give complete transparency to readers. Reversioning allows the authors to  correct mistakes transparently,  along with a response to the red flag. Escalation, should a dispute occur, will still need to be taken to the relevant Research Integrity Office for the authors.'
                }
            }
        ]
    },
    {
        title: 'Research Culture',
        href: 'ResearchCulture',
        items: [
            {
                header: 'Hierarchy and pressure',
                content: {
                    problem:
                        'There are currently hierarchical problems in the research culture, based around access and &apos;success&apos; in the publication system. Where there is a strong hierarchy, there is the potential for bullying practices or pressures to perform questionable research practices.',
                    help: 'Octopus removes human gatekeepers to publishing work (e.g. editors or single-blind peer review) where &apos;who you know&apos; can become important. It also makes it easier to produce single-author publications, and removes the need for financial resources to publish, meaning that junior researchers can publish even without the weight of a senior author or grant holder behind them.'
                }
            },
            {
                header: 'Sustainable peer review',
                content: {
                    problem:
                        'The current peer review system is unsustainable and already under great strain due to the ever-increasing numbers of publications (since quantity of publications is incentivised), all needing 2+ reviewers.',
                    help: 'Firstly, Octopus is designed to reduce the pressures for authors to publish a high volume of output in favour of better assessing the quality of outputs, meaning that authors are incentivised to produce fewer but higher quality publications. Secondly, making peer review an open and rewarded (as well as assessed) skill so that researchers have an incentive to write reviews (and to review well rather than just often) and see it as part of their work rather than an unrecognised adjunct to it.'
                }
            },
            {
                header: 'Accountability',
                content: {
                    problem:
                        'There are currently problems of accountability for poor work (or even misconduct) in parts of the research process (e.g. falsification of results, poor analysis, image manipulation), since there is often a lack of transparency over details of every stage of the research, and who is responsible for what.',
                    help: 'The smaller author groups and smaller publication units within Octopus increase both the accountability and transparency of the research process - it&apos;s easier to see exactly what has been done at each stage (as each is a separate publication), and by whom (as each publication has its own author list).'
                }
            },
            {
                header: 'Tracking misconduct',
                content: {
                    problem: 'It is difficult to track &apos;repeat offenders&apos; for research misconduct.',
                    help: 'In Octopus, &apos;red flags&apos; will be visible on an author&apos;s page and on publication pages. They will also be visible on the personal page of the reader who raised the flag. This ensures that red flags are prominent, but the full detail of the conversation between the author and flagger will also be visible, allowing users to use their judgement on whether the red flags represent serious concerns against the author or not. This will allow an easy search for potential authors of concern, and potential flaggers of many concerns. These flaggers may be doing a good service to the community, or committing misconduct themselves. The transparency of the process on Octopus allows a judgement over which.'
                }
            },
            {
                header: 'A more collaborative research culture',
                content: {
                    problem:
                        'Researchers are much more competitive than collaborative with each other, and fearful of sharing ideas because of the concern of being &apos;scooped&apos;.',
                    help: 'Octopus is designed to change the emphasis of research so that &apos;findings&apos; are no longer the main aspect of a piece of research that is assessed; instead we want to support quality at every stage of the research process.<br/><br/>Shifting the focus from the narrative emphasis of the traditional article, in Octopus there is no pressure to &apos;prove a hypothesis&apos;, only to come up with a good one and share it with the community.<br/><br/>Octopus allows researchers to see their work as a piece in a bigger jigsaw picture – that everyone is working around the world, and through time, to build a picture of how the world works, and that an individual researchers&apos; job is to ensure that each piece they contribute to that picture is as high quality as it can be. The publication of each &apos;piece&apos;, rather than trying to contribute whole pictures of one&apos;s own, should change the way that researchers see the research process, and behave within it. We hope that incentivising and positioning reviewing as a scientific skill like any other can help us set a good example and standard of what good, constructive critique looks like.<br/><br/>Once research is published in Octopus, it is time-stamped and registered to the authors. By acting as a public registry for ideas and for work, Octopus aims to remove the fear of &apos;scooping&apos; and in fact to encourage people to record their ideas in it to protect themselves from such an eventuality.'
                }
            }
        ]
    },
    {
        title: 'Fair credit',
        href: 'FairCredit',
        items: [
            {
                header: 'More meaningful author groups',
                content: {
                    problem:
                        'Traditional research articles often have large author groups which do not accurately reflect who does what, which can be especially problematic for junior or specialist researchers (e.g. analysts, technicians).',
                    help: 'Smaller publications encourage smaller author groups that more accurately reflect the work done at each stage, leading to more meritocratic recognition, especially for specialists (see below).'
                }
            },
            {
                header: 'Recognition for specialists',
                content: {
                    problem:
                        'There is a lack of recognition for specialists, and unspecialised researchers are incentivised to complete some aspects of a research chain which they are not trained to do (e.g. statistical analysis, code-writing, qualitative analysis) in order to be able to complete a full research article for publication.',
                    help: 'In Octopus, the publication of smaller units of research work means that specialists can now publish their own work, or publish in smaller author groups, with different groups potentially working at each stage to form a collaborative whole. This can allow more specific recognition for individuals&apos; work and specialities. Over time, an author&apos;s Octopus profile page will build a picture of the kind of work they publish (e.g. they publish mainly hypotheses – they&apos;re an &apos;ideas person&apos;; or they publish mainly protocols – they&apos;re a &apos;design person&apos;; or they publish mainly analyses etc). Because each stage of work is judged on its own merits, researchers should feel less compelled to produce all stages of the research process.'
                }
            },
            {
                header: 'Proxy metrics and &apos;impact&apos;',
                content: {
                    problem:
                        'The only metrics to judge quality, of both research and researchers, at the moment are poor proxies such as H-index and Journal Impact Factors, leading to perverse incentive structures.',
                    help: 'We want to move away from poor proxy metrics of value and impact. Currently the red flag process allows users to quickly indicate a serious issue with a publication, which the author can then address. The peer review system gives a qualitative assessment of a publication. Longer-term, we are exploring different approaches to assessment with the research community, such as additional community moderation features, which will allow users to rate content quantitatively. We also encourage integrations with automatic plagiarism detection software and image manipulation detection systems.'
                }
            },
            {
                header: 'Copyright',
                content: {
                    problem: 'Authors often have to sign over copyright when publishing their work.',
                    help: 'Octopus is not a &apos;publisher&apos; and authors stay in control of their own copyright, choosing a Creative Commons copyright license. Our only requirements are that the work is published open access, and that it allows derivative works (so that we can include it in upcoming features like translation).'
                }
            }
        ]
    },
    {
        title: 'Finding relevant research',
        href: 'FindingRelaventResearch',
        items: [
            {
                header: 'Finding research',
                content: {
                    problem:
                        'There is a huge volume of traditional publications, in different journals and books, making it very difficult to find relevant quality research.',
                    help: 'Each Octopus publication must be linked to at least one other, creating a network of branching chains. These chains each start with a &apos;Problem&apos;, providing a structure to the content on the site and making it easy to find content related to a certain research problem.<br/><br/>Readers can also create (and vote on) cross links between publications to join up research chains that might otherwise become silos.<br/><br/>Researchers can subscribe to publications, and so receive notifications of newly published work linked, for instance, to a particular research problem or dataset.'
                }
            },
            {
                header: 'Cross- and multi-disciplinary work',
                content: {
                    problem:
                        'There are currently silos and divides between research fields as researchers tend to work in particular groups and publish in certain journals. Truly interdisciplinary work can be hard to find a journal to publish in.',
                    help: 'There are no disciplinary categories in Octopus. Instead, all research is published in the one place and linked to other publications.<br/><br/>Readers can also add relevant cross-links, regardless of discipline. For example, a reader could cross-link a publication in one field with a publication in what would traditionally be recognised as another field. This will hopefully build bridges between traditional silos and recognise cross and multi-disciplinary work.'
                }
            },
            {
                header: 'Linking research to those interested in it',
                content: {
                    problem:
                        'Practitioners or policy-makers often have research questions or needs and no obvious way to highlight them to researchers who may be able to help answer them.',
                    help: 'Anyone with an ORCiD can log in and publish a Research Problem on Octopus, which can then be found by others and be the start of a chain of research. Additionally, we are building methods to automatically pull in Research Problems already published by some institutions, such as UK Government department &apos;Areas of Research Interest&apos;. When researchers publish work linked to these in Octopus, they are given the opportunity to pass their details on to the relevant department, who will also be notified of their research.'
                }
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
            <title>{Config.urls.octopusAims.title}</title>
            <meta name="description" content={Config.urls.octopusAims.description} />
            <meta name="og:title" content={Config.urls.octopusAims.title} />
            <meta name="og:description" content={Config.urls.octopusAims.description} />
            <meta name="keywords" content={Config.urls.octopusAims.keywords.join(', ')} />
            <link rel="canonical" href={Config.urls.octopusAims.canonical} />
        </Head>

        <Layouts.Standard fixedHeader={false}>
            <section className="container mx-auto px-8 pb-10 pt-10 lg:gap-4 lg:pt-20">
                <Components.PageTitle text="Octopus in detail: aims and priorities" />
                <span className="mx-auto my-6 flex  space-x-1 font-montserrat text-xl font-normal text-grey-800 transition-colors duration-500 dark:text-white-100">
                    Octopus is designed to change the incentive structure within the research community to ensure that
                    what is recognised, rewarded, and encouraged is what will best drive best research practices. in the
                    &apos;right&apos; direction. Here we&apos;ve provided more information on each of the issues Octopus
                    is actively trying to help solve:
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
                                                <strong>Problem:</strong> {parse(item.content.problem)}
                                                <br />
                                                <br />
                                                <strong>What Octopus is doing to help: </strong>{' '}
                                                {parse(item.content.help)}
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
