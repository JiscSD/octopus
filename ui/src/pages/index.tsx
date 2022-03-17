import Head from 'next/head';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Helpers from '@helpers';
import * as Config from '@config';
import * as Stores from '@stores';
import * as Types from '@types';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    return {
        props: {}
    };
};

const Home: Types.NextPage = (): JSX.Element => {
    const toggleCmdPalette = Stores.useGlobalsStore((state: Types.GlobalsStoreType) => state.toggleCmdPalette);

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
                        <h1 className="mb-8 block text-center font-montserrat text-2xl font-black !leading-tight tracking-tight text-grey-700 transition-colors duration-500 dark:text-white lg:text-5xl ">
                            A new way to publish your scientific work that&apos;s fast, free and fair.
                        </h1>
                        <p className="mx-auto mb-10 block text-center font-montserrat text-base font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100 lg:w-8/12 lg:text-lg">
                            Designed to replace journals and papers as the place to establish priority and record your
                            work in full detail.
                        </p>

                        <div className="mx-auto flex w-fit space-x-6">
                            <Components.Link
                                href={Config.urls.about.path}
                                className="flex items-center rounded-lg bg-grey-700 px-4 font-medium text-white transition-colors duration-500 hover:bg-grey-600 dark:bg-teal-500 dark:hover:bg-teal-600"
                            >
                                <span className="text-center font-montserrat text-sm leading-none tracking-wide">
                                    Learn more
                                </span>
                            </Components.Link>
                            <button
                                aria-label="Open search"
                                className="flex w-52 items-center justify-between rounded-lg bg-teal-400 p-3 text-center outline-0 transition-colors duration-300 hover:bg-teal-300 focus:ring-2 focus:ring-yellow-400 dark:bg-grey-700 dark:hover:bg-grey-600"
                                onClick={(e) => toggleCmdPalette()}
                            >
                                <OutlineIcons.SearchIcon className="h-6 w-6 text-white transition-colors duration-500 dark:text-teal-500" />
                                <span className="font-montserrat text-sm text-white transition-colors duration-500 dark:text-grey-50">
                                    Quick search...
                                </span>
                                <span className="font-montserrat text-xs text-white transition-colors duration-500 dark:text-grey-50">
                                    {Helpers.setOSKey()}
                                </span>
                            </button>
                        </div>
                    </div>
                </section>

                <Components.LearnAboutOctopus />

                <section className="container mx-auto px-8 py-16">
                    <Components.PageSubTitle text="Get started with Octopus" className="text-center" />

                    <div className="grid grid-cols-1 gap-4 lg:mt-16 lg:grid-cols-2 2xl:grid-cols-3">
                        <Components.ActionCard
                            title="Create an account"
                            content="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laborum blanditiis, harum voluptatem, voluptate vero non"
                            icon={<OutlineIcons.UserGroupIcon className="h-8 w-8 text-teal-500" />}
                            link={Config.urls.orcidLogin.path}
                            linkText="Create an account"
                        />
                        <Components.ActionCard
                            title="Learn more account Octopus"
                            content="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laborum blanditiis, harum voluptatem, voluptate vero non"
                            icon={<OutlineIcons.BookOpenIcon className="h-8 w-8 text-teal-500" />}
                            link={Config.urls.about.path}
                            linkText="Learn more"
                        />

                        <Components.ActionCard
                            title="Browse publications"
                            content="Browse our most recent publications, and different types of publication. You don't need to log in."
                            icon={<OutlineIcons.DesktopComputerIcon className="h-8 w-8 text-teal-500" />}
                            link={Config.urls.browsePublications.path}
                            linkText="Browse publications"
                        />
                        <Components.ActionCard
                            title="Search publications"
                            content="Anyone can read any publication on Octopus. Search by keyword, title or author to discover more."
                            icon={<OutlineIcons.SearchIcon className="h-8 w-8 text-teal-500" />}
                            link={Config.urls.search.path}
                            linkText="Search publications"
                        />

                        <Components.ActionCard
                            title="Publish your work"
                            content="Publishing in Octopus is free and simple, with eight publications types aligned with the scientific process."
                            icon={<OutlineIcons.PencilIcon className="h-8 w-8 text-teal-500" />}
                            link={Config.urls.createPublication.path}
                            linkText="Publish your work"
                        />
                        <Components.ActionCard
                            title="Need help?"
                            content="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laborum blanditiis, harum voluptatem, voluptate vero non"
                            icon={<OutlineIcons.QuestionMarkCircleIcon className="h-8 w-8 text-teal-500" />}
                            link={Config.urls.faq.path}
                            linkText="See FAQ's"
                        />
                    </div>
                </section>
            </Layouts.Standard>
        </>
    );
};

export default Home;
