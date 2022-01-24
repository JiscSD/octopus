import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import {
    DesktopComputerIcon,
    PencilIcon,
    SearchIcon
} from '@heroicons/react/outline';

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
                <meta
                    name="description"
                    content={Config.urls.home.description}
                />
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
                        <div className="block mx-auto lg:w-2/3 2xl:w-1/2">
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
                    <div className="container mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <h2 className="block font-montserrat font-bold text-2xl text-grey-800 dark:text-white lg:col-span-2">
                            What is Octopus?
                        </h2>
                        <div className="flex justify-center items-center rounded-lg w-full h-80 bg-white p-4">
                            video here
                        </div>
                        <div>
                            <h3 className="block mb-2 font-montserrat font-bold text-xl text-grey-800 dark:text-white">
                                Publish freely
                            </h3>
                            <p className="block mb-10 text-base text-grey-800 dark:text-white">
                                Upload your publications when they are done. No
                                need to wait around until you have a full
                                scientific paper ready.
                            </p>
                            <h3 className="block mb-2 font-montserrat font-bold text-xl text-grey-800 dark:text-white">
                                Establish priority
                            </h3>
                            <p className="block mb-10 text-base text-grey-800 dark:text-white">
                                Stake your claim on an idea early, and establish
                                your interests.
                            </p>
                            <h3 className="block mb-2 font-montserrat font-bold text-xl text-grey-800 dark:text-white">
                                Get quick peer reviews
                            </h3>
                            <p className="block mb-8 text-base text-grey-800 dark:text-white">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit.
                            </p>
                            <h3 className="block mb-2 font-montserrat font-bold text-xl text-grey-800 dark:text-white">
                                Meritocracy
                            </h3>
                            <p className="block mb-24 text-base text-grey-800 dark:text-white">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit.
                            </p>

                            <Components.ExtendedLink
                                href="https://google.co.uk"
                                title="Read more about Octopus"
                            />
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
                        <h2 className="block mb-6 lg:mb-16 w-fit mx-auto font-montserrat font-bold text-2xl text-grey-900 dark:text-white transition-colors duration-500">
                            Get started with Octopus
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <Components.Paper>
                                <DesktopComputerIcon className="w-10 h-10 mb-8 text-teal-500" />
                                <h3 className="block mb-6 font-montserrat font-bold text-lg text-grey-800 dark:text-white transition-colors duration-500">
                                    Browse publications
                                </h3>
                                <p className="block mb-8 font-normal text-grey-800 dark:text-grey-50 transition-colors duration-500">
                                    Designed to replace journals and papers as
                                    the place to establish priority and record
                                    your work in full detail.
                                </p>
                                <Components.ExtendedLink
                                    href="https://google.co.uk"
                                    title="Browse publications"
                                />
                            </Components.Paper>
                            <Components.Paper>
                                <SearchIcon className="w-10 h-10 mb-8 text-teal-500" />
                                <h3 className="block mb-6 font-montserrat font-bold text-lg text-grey-800 dark:text-white transition-colors duration-500">
                                    Search publications
                                </h3>
                                <p className="block mb-8 font-normal text-grey-800 dark:text-grey-50 transition-colors duration-500">
                                    Designed to replace journals and papers as
                                    the place to establish priority and record
                                    your work in full detail.
                                </p>
                                <Components.ExtendedLink
                                    href="https://google.co.uk"
                                    title="Search publications"
                                />
                            </Components.Paper>
                            <Components.Paper>
                                <PencilIcon className="w-10 h-10 mb-8 text-teal-500" />
                                <h3 className="block mb-6 font-montserrat font-bold text-lg text-grey-800 dark:text-white transition-colors duration-500">
                                    Publish your work
                                </h3>
                                <p className="block mb-8 font-normal text-grey-800 dark:text-grey-50 transition-colors duration-500">
                                    Designed to replace journals and papers as
                                    the place to establish priority and record
                                    your work in full detail.
                                </p>
                                <Components.ExtendedLink
                                    href="https://google.co.uk"
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
                    <div className="container mx-auto px-8 py-16 lg:py-12 text-grey-900 dark:text-white">
                        <h2 className="block mb-6 xl:mb-8 font-montserrat font-bold text-2xl lg:col-span-2">
                            Help us improve Octopus
                        </h2>
                        <h3 className="block mb-6 xl:mb-12 xl:w-1/2 font-montserrat font-semibold text-xl">
                            Help us to make Octopus the best it can be. if you
                            have feedback, please contact us.
                        </h3>
                        <Components.Button href="" title="Send us feedback" />
                    </div>
                </Components.SectionTwo>
            </Layouts.Standard>
        </>
    );
};

export default Home;
