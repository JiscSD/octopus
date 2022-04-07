import Head from 'next/head';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Components from '@components';
import * as Interfaces from '@interfaces';
import * as Layouts from '@layouts';
import * as Helpers from '@helpers';
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
        const latestResponse = await api.search('publications', null, Config.values.publicationTypes.join(), 10, 0);
        latest = latestResponse.data as Interfaces.Publication[];
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
                            A new way to publish your scientific work that&apos;s fast, free and fair.
                        </h1>
                        <p className="mx-auto mb-10 block text-center font-montserrat text-base font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100 lg:w-8/12 lg:text-lg">
                            Designed to replace journals and papers as the place to establish priority and record your
                            work in full detail.
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
                                className="flex w-52 items-center justify-between rounded-lg bg-teal-400 p-3 text-center outline-0 transition-colors duration-300 hover:bg-teal-300 focus:ring-2 focus:ring-yellow-400 dark:bg-grey-700 dark:hover:bg-grey-600"
                                onClick={(e) => toggleCmdPalette()}
                            >
                                <OutlineIcons.SearchIcon className="h-6 w-6 text-white-50 transition-colors duration-500 dark:text-teal-500" />
                                <span className="font-montserrat text-sm text-white-50 transition-colors duration-500 dark:text-grey-50">
                                    Quick search...
                                </span>
                                <span className="font-montserrat text-xs text-white-50 transition-colors duration-500 dark:text-grey-50">
                                    {Helpers.setOSKey()}
                                </span>
                            </button>
                        </div>
                    </div>
                </section>

                {/** Mockup flow not ready */}
                {/* <section className="container mx-auto py-16 px-8 2xl:py-28">
                    <Components.MockupFlow />
                </section> */}

                <section className="container mx-auto px-8 py-16 2xl:py-28 ">
                    {/* <Components.PageSubTitle text="Get started with Octopus" className="text-center" /> */}

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 2xl:grid-cols-3">
                        <Components.ActionCard
                            title="Publish your work"
                            content="Publishing in Octopus is free and simple, with eight publications types aligned with the scientific process."
                            icon={<OutlineIcons.PencilIcon className="h-8 w-8 text-teal-500" />}
                            link={Config.urls.createPublication.path}
                            linkText="Publish your work"
                        />
                        <Components.ActionCard
                            title="Search publications"
                            content="Anyone can read any publication on Octopus. Search by keyword, title or author to discover more."
                            icon={<OutlineIcons.SearchIcon className="h-8 w-8 text-teal-500" />}
                            link={Config.urls.search.path}
                            linkText="Search publications"
                        />
                        <Components.ActionCard
                            title="Browse publications"
                            content="View recent publications and  and browse by publication type."
                            icon={<OutlineIcons.DesktopComputerIcon className="h-8 w-8 text-teal-500" />}
                            link={Config.urls.browsePublications.path}
                            linkText="Browse publications"
                        />
                        <Components.ActionCard
                            title="Create an account"
                            content="Octopus accounts are created via ORCID login."
                            icon={<OutlineIcons.UserGroupIcon className="h-8 w-8 text-teal-500" />}
                            link={Config.urls.orcidLogin.path}
                            linkText="Create an account"
                        />
                        <Components.ActionCard
                            title="Learn more account Octopus"
                            content="Read more about what makes Octopus different, as well as our priorities and plans."
                            icon={<OutlineIcons.BookOpenIcon className="h-8 w-8 text-teal-500" />}
                            link={Config.urls.about.path}
                            linkText="Learn more"
                        />

                        <Components.ActionCard
                            title="Need help?"
                            content="Review our FAQs to find out more about how the platform works."
                            icon={<OutlineIcons.QuestionMarkCircleIcon className="h-8 w-8 text-teal-500" />}
                            link={Config.urls.faq.path}
                            linkText="See FAQ's"
                        />
                    </div>
                </section>

                {/* <section className="container mx-auto border-t border-grey-100 px-8 py-16 dark:border-grey-600 2xl:py-28">
                    <div className="grid grid-cols-3 gap-x-32">
                        <div className="space-y-4">
                            <Components.PageSubTitle text="Lorem ipsum" />
                            <p className="text-grey-800 transition-colors duration-500 dark:text-white-100">
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vitae adipisci harum eius
                                autem, laudantium iste labore libero voluptatem nisi praesentium. Sint, fuga possimus
                                animi accusantium recusandae excepturi deleniti! Perspiciatis, nesciunt!
                            </p>
                        </div>
                        <div className="col-span-2">
                            <Components.LatestPublications publications={props.latest} />
                        </div>
                    </div>
                </section> */}
            </Layouts.Standard>
        </>
    );
};

export default Home;
