import Head from 'next/head';
import * as OutlineIcons from '@heroicons/react/outline';
import * as Components from '@components';
import * as Interfaces from '@interfaces';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Stores from '@stores';
import * as Types from '@types';
import * as api from '@api';

interface Errors {
    latest: null | string;
}

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const errors: Errors = {
        latest: null
    };

    let latest: unknown = [];
    try {
        const latestResponse = await api.search<Interfaces.Publication>(
            'publications',
            null,
            10,
            0,
            Config.values.publicationTypes.join()
        );
        latest = latestResponse.data;
    } catch (err) {
        const { message } = err as Interfaces.JSONResponseError;
        errors.latest = message;
    }

    return {
        props: {
            latest,
            errors
        }
    };
};

type Props = {
    latest: Interfaces.Publication[];
    errors: Errors;
};

const Home: Types.NextPage<Props> = (props): React.ReactElement => {
    const toggleCmdPalette = Stores.useGlobalsStore((state: Types.GlobalsStoreType) => state.toggleCmdPalette);
    console.log({ branch: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF });
    return (
        <>
            <Head>
                <meta name="description" content={Config.urls.home.description} />
                <meta name="keywords" content={Config.urls.home.keywords.join(', ')} />
                <link rel="canonical" href={Config.urls.home.canonical} />
                <title>{Config.urls.home.title}</title>
            </Head>
            <Layouts.Standard fixedHeader={false}>
                <section className="container mx-auto px-8 py-8 lg:py-24">
                    <div className="mx-auto block lg:w-9/12 xl:w-10/12 2xl:w-7/12">
                        <h1 className="mb-8 block text-center font-montserrat text-2xl font-black !leading-tight tracking-tight text-grey-700 transition-colors duration-500 dark:text-white-50 lg:text-5xl ">
                            Free, fast and fair: the global primary research record where researchers record their work
                            in full detail
                        </h1>
                        <p className="mx-auto mb-10 block text-center font-montserrat text-base font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100 lg:w-8/12 lg:text-lg">
                            Octopus is a new way to register research. It is the place to publish the version of record,
                            enabling peer review and quality assessment and allowing the academic community to build
                            upon the latest work.
                        </p>

                        <div className="mx-auto flex w-fit space-x-6">
                            <Components.Link
                                href={Config.urls.about.path}
                                className="flex items-center rounded-lg bg-grey-700 px-4 font-medium text-white-50 transition-colors duration-500 hover:bg-grey-600 dark:bg-teal-600 dark:hover:bg-teal-600"
                            >
                                <span className="text-center font-montserrat text-sm leading-none tracking-wide">
                                    Learn more
                                </span>
                            </Components.Link>
                            <button
                                aria-label="Open search"
                                className="flex w-52 items-center justify-between rounded-lg bg-teal-600 p-3 text-center outline-0 transition-colors duration-300 hover:bg-teal-700 focus:ring-2 focus:ring-yellow-400 dark:bg-grey-700 dark:hover:bg-grey-600"
                                onClick={(e) => toggleCmdPalette()}
                            >
                                <OutlineIcons.SearchIcon className="h-6 w-6 text-white-50 transition-colors duration-500 dark:text-teal-500" />
                                <span className="mx-auto font-montserrat text-sm text-white-50 transition-colors duration-500 dark:text-grey-50">
                                    Quick search...
                                </span>
                            </button>
                        </div>
                    </div>
                </section>
                <section className="container mx-auto px-8 py-16 2xl:py-28 ">
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
                            icon={<OutlineIcons.SearchIcon className="h-8 w-8 text-teal-500" />}
                            link={Config.urls.search.path}
                            linkText="Read publications"
                        />
                        <Components.ActionCard
                            title="Browse publications"
                            content="Every publication in Octopus is linked to another, forming branching chains of research. You can navigate these chains from every publication page to browse areas of research and discover something new."
                            icon={<OutlineIcons.DesktopComputerIcon className="h-8 w-8 text-teal-500" />}
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
