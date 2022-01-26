import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { DesktopComputerIcon, PencilIcon, SearchIcon } from '@heroicons/react/outline';

import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Components from '@components';

export const getServerSideProps: GetServerSideProps = async (context) => {
    return {
        props: {}
    };
};

const Home: NextPage = (): JSX.Element => {
    return (
        <>
            <Head>
                <meta name="description" content={Config.urls.home.description} />
                <meta name="keywords" content={Config.urls.home.keywords} />
                <link rel="canonical" href={Config.urls.home.canonical} />
                <title>{Config.urls.home.title}</title>
            </Head>
            <Layouts.Standard fixedHeader={false}>
                {/** Search section */}
                <Components.Section
                    id="search"
                    className="bg-teal-50 dark:bg-grey-400"
                    waveFillTop="fill-teal-100 dark:fill-grey-500 transition-colors duration-500"
                    waveFillMiddle="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                    waveFillBottom="fill-teal-300 dark:fill-grey-900 transition-colors duration-500"
                >
                    <div className="container mx-auto px-8 pt-16 pb-8">
                        <div className="mx-auto block lg:w-2/3 2xl:w-1/2">
                            <Components.Search />
                        </div>
                    </div>
                    {/** Intro */}
                </Components.Section>
                {/** Intro */}
                <Components.SectionTwo
                    id="content"
                    className="bg-teal-300 dark:bg-grey-900"
                    waveFillTop="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                    waveFillMiddle="fill-teal-100 dark:fill-grey-700 transition-colors duration-500"
                    waveFillBottom="fill-teal-50 dark:fill-grey-800 transition-colors duration-500"
                >
                    <div className="container mx-auto grid grid-cols-1 gap-6 px-8 py-16 lg:grid-cols-2">
                        <h2 className="block font-montserrat text-2xl font-bold text-grey-800 dark:text-white lg:col-span-2">
                            What is Octopus?
                        </h2>
                        <div className="flex h-80 w-full items-center justify-center rounded-lg bg-white p-4">
                            video here
                        </div>
                        <div>
                            <h3 className="mb-2 block font-montserrat text-xl font-bold text-grey-800 dark:text-white">
                                Publish freely
                            </h3>
                            <p className="mb-10 block text-base text-grey-800 dark:text-white">
                                Upload your publications when they are done. No need to wait around until you have a
                                full scientific paper ready.
                            </p>
                            <h3 className="mb-2 block font-montserrat text-xl font-bold text-grey-800 dark:text-white">
                                Establish priority
                            </h3>
                            <p className="mb-10 block text-base text-grey-800 dark:text-white">
                                Stake your claim on an idea early, and establish your interests.
                            </p>
                            <h3 className="mb-2 block font-montserrat text-xl font-bold text-grey-800 dark:text-white">
                                Get quick peer reviews
                            </h3>
                            <p className="mb-8 block text-base text-grey-800 dark:text-white">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            </p>
                            <h3 className="mb-2 block font-montserrat text-xl font-bold text-grey-800 dark:text-white">
                                Meritocracy
                            </h3>
                            <p className="mb-24 block text-base text-grey-800 dark:text-white">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            </p>

                            <Components.ExtendedLink href={Config.urls.about.path} title="Read more about Octopus" />
                        </div>
                    </div>
                </Components.SectionTwo>
                {/** Get started */}
                <Components.Section
                    id="getStarted"
                    className="bg-teal-50 dark:bg-grey-800"
                    waveFillTop="fill-teal-100 dark:fill-grey-500 transition-colors duration-500"
                    waveFillMiddle="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                    waveFillBottom="fill-teal-300 dark:fill-grey-900 transition-colors duration-500"
                >
                    <div className="container mx-auto px-8 py-16">
                        <h2 className="mx-auto mb-6 block w-fit font-montserrat text-2xl font-bold text-grey-900 transition-colors duration-500 dark:text-white lg:mb-16">
                            Get started with Octopus
                        </h2>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                            <Components.Paper>
                                <DesktopComputerIcon className="mb-8 h-10 w-10 text-teal-500" />
                                <h3 className="mb-6 block font-montserrat text-lg font-bold text-grey-800 transition-colors duration-500 dark:text-white">
                                    Browse publications
                                </h3>
                                <p className="mb-8 block font-normal text-grey-800 transition-colors duration-500 dark:text-grey-50">
                                    Designed to replace journals and papers as the place to establish priority and
                                    record your work in full detail.
                                </p>
                                <Components.ExtendedLink
                                    href={Config.urls.browsePublications.path}
                                    title="Browse publications"
                                />
                            </Components.Paper>
                            <Components.Paper>
                                <SearchIcon className="mb-8 h-10 w-10 text-teal-500" />
                                <h3 className="mb-6 block font-montserrat text-lg font-bold text-grey-800 transition-colors duration-500 dark:text-white">
                                    Search publications
                                </h3>
                                <p className="mb-8 block font-normal text-grey-800 transition-colors duration-500 dark:text-grey-50">
                                    Designed to replace journals and papers as the place to establish priority and
                                    record your work in full detail.
                                </p>
                                <Components.ExtendedLink href={Config.urls.search.path} title="Search publications" />
                            </Components.Paper>
                            <Components.Paper>
                                <PencilIcon className="mb-8 h-10 w-10 text-teal-500" />
                                <h3 className="mb-6 block font-montserrat text-lg font-bold text-grey-800 transition-colors duration-500 dark:text-white">
                                    Publish your work
                                </h3>
                                <p className="mb-8 block font-normal text-grey-800 transition-colors duration-500 dark:text-grey-50">
                                    Designed to replace journals and papers as the place to establish priority and
                                    record your work in full detail.
                                </p>
                                <Components.ExtendedLink
                                    href={Config.urls.createPublication.path}
                                    title="Publish your work"
                                />
                            </Components.Paper>
                        </div>
                    </div>
                </Components.Section>
                {/** Help improve */}
                <Components.SectionTwo
                    id="helpImprove"
                    className="bg-teal-300 dark:bg-grey-900"
                    waveFillTop="fill-teal-500 dark:fill-grey-600 transition-colors duration-500"
                    waveFillMiddle="fill-teal-600 dark:fill-grey-700 transition-colors duration-500"
                    waveFillBottom="fill-teal-700 dark:fill-grey-800 transition-colors duration-500"
                >
                    <div className="container mx-auto px-8 py-16 text-grey-900 dark:text-white lg:py-12">
                        <h2 className="mb-6 block font-montserrat text-2xl font-bold lg:col-span-2 xl:mb-8">
                            Help us improve Octopus
                        </h2>
                        <h3 className="mb-6 block font-montserrat text-xl font-semibold xl:mb-12 xl:w-1/2">
                            Help us to make Octopus the best it can be. if you have feedback, please contact us.
                        </h3>
                        <Components.Button href={Config.urls.feedback.path} title="Send us feedback" />
                    </div>
                </Components.SectionTwo>
            </Layouts.Standard>
        </>
    );
};

export default Home;
