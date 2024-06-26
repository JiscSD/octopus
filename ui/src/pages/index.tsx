import Head from 'next/head';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as Components from '@/components';
import * as Layouts from '@/layouts';
import * as Config from '@/config';
import * as Types from '@/types';

const Home: Types.NextPage = (props): React.ReactElement => {
    return (
        <>
            <Head>
                <title>{Config.urls.home.title}</title>
                <meta name="description" content={Config.urls.home.description} />
                <meta name="og:title" content={Config.urls.home.title} />
                <meta name="og:description" content={Config.urls.home.description} />
                <meta name="keywords" content={Config.urls.home.keywords.join(', ')} />
                <link rel="canonical" href={Config.urls.home.canonical} />
            </Head>
            <Layouts.Standard fixedHeader={false}>
                <section className="container mx-auto px-8 pt-8 lg:pt-24">
                    <div className="mx-auto block lg:w-9/12 xl:w-10/12 2xl:max-w-5xl">
                        <h1 className="mb-8 block text-center font-montserrat text-2xl font-black !leading-tight tracking-tight text-grey-700 transition-colors duration-500 dark:text-white-50 lg:text-5xl ">
                            Free, fast and fair: the global primary research record where researchers publish their work
                            in full detail
                        </h1>
                        <p className="mx-auto mb-10 block text-center font-montserrat text-base font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100 lg:w-8/12 lg:text-lg">
                            Octopus is a new publishing platform for scholarly research. Funded by UKRI – the UK
                            government research funder.
                        </p>
                        <p className="mx-auto mb-10 block text-center font-montserrat text-base font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100 lg:w-8/12 lg:text-lg">
                            Here researchers can publish all their work for free, in full detail, enabling peer review
                            and quality assessment, gaining credit for what they have done, and allowing the research
                            community to build upon it.
                        </p>
                        <div className="mx-auto flex w-full flex-wrap gap-6 sm:w-fit sm:justify-between">
                            <Components.Link
                                href={Config.urls.about.path}
                                className="flex flex-1 items-center rounded-lg bg-grey-700 p-4 font-medium text-white-50 transition-colors duration-500 hover:bg-grey-600 dark:bg-teal-600 dark:hover:bg-teal-600 sm:w-fit sm:flex-auto sm:px-4"
                            >
                                <span className="w-full text-center font-montserrat text-sm leading-none tracking-wide">
                                    Learn more
                                </span>
                            </Components.Link>
                            <Components.Link
                                href={Config.urls.authorGuide.path}
                                className="flex flex-1 items-center space-x-4 rounded-lg bg-grey-700 p-4 font-medium text-white-50 transition-colors duration-500 hover:bg-grey-600 dark:bg-teal-600 dark:hover:bg-teal-600 sm:w-fit sm:flex-auto sm:px-4"
                            >
                                <span className="w-full text-center font-montserrat text-sm leading-none tracking-wide">
                                    Author Guide
                                </span>
                            </Components.Link>

                            <Components.Link
                                href={`${Config.urls.search.path}/publications`}
                                className="flex w-full items-center justify-between rounded-lg bg-teal-700 p-4 font-medium text-white-50 outline-0 transition-colors duration-300 hover:bg-teal-600 focus:ring-2 focus:ring-yellow-400 dark:bg-teal-600 dark:hover:bg-teal-600 sm:w-auto"
                            >
                                <span className="w-full text-center font-montserrat text-sm leading-none tracking-wide">
                                    Find Publications
                                </span>
                            </Components.Link>
                        </div>
                    </div>
                </section>
                <section className="container mx-auto px-8 py-20 text-center">
                    <h2 className="mb-8 font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-100 lg:text-3xl">
                        Research Culture Report
                    </h2>
                    <p className="mx-auto mb-6 text-center font-montserrat text-base font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100 lg:w-8/12 lg:text-lg">
                        Researchers at the University of Bristol have recently conducted an investigation into the
                        current state of the research culture. They found academic researchers demoralised by a culture
                        that disincentivises sharing and collaboration, encourages questionable research practices, and
                        increases the risk of bias. These findings underline the need for a platform such as Octopus.
                        Their results are detailed in the report &quot;A snapshot of the academic research culture in
                        2023 and how it might be improved&quot;.
                    </p>

                    <Components.Link
                        href={Config.urls.researchCultureReport.path}
                        className="mx-auto flex w-full items-center justify-between rounded-lg bg-teal-700 p-4 font-medium text-white-50 outline-0 transition-colors duration-300 hover:bg-teal-600 focus:ring-2 focus:ring-yellow-400 dark:bg-teal-600 dark:hover:bg-teal-600 sm:w-auto sm:w-fit"
                    >
                        <span className="w-full text-center font-montserrat text-sm leading-none tracking-wide">
                            Learn more
                        </span>
                    </Components.Link>
                </section>
                <section className="container mx-auto px-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 2xl:grid-cols-3">
                        <Components.ActionCard
                            title="Publish your work"
                            content="Recording your work on Octopus is different from publishing a paper. There are eight publication types that are aligned with the research process and designed to help researchers of all types share their work and be recognised for it."
                            icon={<OutlineIcons.PencilIcon className="h-8 w-8 text-teal-500" />}
                            link={Config.urls.createPublication.path}
                            linkText="Publish your work"
                        />
                        <Components.ActionCard
                            title="Read publications"
                            content="Anyone can read anything in Octopus &#8211; it's designed to make primary research openly available to all."
                            icon={<OutlineIcons.MagnifyingGlassIcon className="h-8 w-8 text-teal-500" />}
                            link={Config.urls.search.path}
                            linkText="Read publications"
                        />
                        <Components.ActionCard
                            title="Browse publications"
                            content="Every publication in Octopus is linked to another, forming branching chains of research. You can navigate these chains from every publication page to browse areas of research and discover something new."
                            icon={<OutlineIcons.ComputerDesktopIcon className="h-8 w-8 text-teal-500" />}
                            link={Config.urls.browsePublications.path}
                            linkText="Browse publications"
                        />
                        <Components.ActionCard
                            title="Create an account"
                            content="Before you can publish research work, you need to create an account via ORCID®. ORCID is a system of unique, persistent digital identifiers developed specifically for researchers."
                            icon={<OutlineIcons.UserGroupIcon className="h-8 w-8 text-teal-500" />}
                            link={Config.urls.orcidLogin.path}
                            linkText="Create an account"
                        />
                        <Components.ActionCard
                            title="Learn more about Octopus"
                            content="Octopus is designed to incentivise best practice in research, utilise the opportunities of open access, and to improve the research culture."
                            icon={<OutlineIcons.BookOpenIcon className="h-8 w-8 text-teal-500" />}
                            link={Config.urls.about.path}
                            linkText="Learn more"
                        />
                        <Components.ActionCard
                            title="FAQs"
                            content="Review our FAQs to find out more about how the platform works."
                            icon={<OutlineIcons.QuestionMarkCircleIcon className="h-8 w-8 text-teal-500" />}
                            link={Config.urls.faq.path}
                            linkText="See FAQs"
                        />
                    </div>
                </section>
            </Layouts.Standard>
        </>
    );
};

export default Home;
