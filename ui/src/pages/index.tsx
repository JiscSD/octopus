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
                <Components.Section
                    id="search"
                    className="bg-teal-50 dark:bg-grey-800"
                    waveFillTop="fill-teal-100 dark:fill-grey-500 transition-colors duration-500"
                    waveFillMiddle="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                    waveFillBottom="fill-teal-300 dark:fill-grey-900 transition-colors duration-500"
                >
                    <div className="container mx-auto px-8 pt-8 pb-8 lg:pt-24">
                        <div className="mx-auto block lg:w-9/12 xl:w-10/12 2xl:w-7/12">
                            <h1 className="mb-8 block text-center font-montserrat text-2xl font-black !leading-tight tracking-tight text-grey-700 transition-colors duration-500 dark:text-white lg:text-5xl ">
                                A new way to publish your scientific work that&apos;s fast, free and fair.
                            </h1>
                            <p className="mx-auto mb-10 block text-center font-montserrat text-base font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100 lg:w-8/12 lg:text-lg">
                                Designed to replace journals and papers as the place to establish priority and record
                                your work in full detail.
                            </p>

                            <div className="mx-auto flex w-fit">
                                <Components.Link
                                    href={Config.urls.about.path}
                                    className="mr-6 flex items-center rounded-lg bg-grey-700 px-4 font-medium text-white outline-0 transition-colors duration-500 hover:bg-grey-600 focus:ring-2 focus:ring-yellow-400 dark:bg-teal-500 dark:hover:bg-teal-600"
                                >
                                    <span className="text-center font-montserrat text-sm leading-none lg:text-base">
                                        Learn more
                                    </span>
                                </Components.Link>
                                <button
                                    aria-label="Open search"
                                    className="flex w-52 items-center justify-between rounded-lg bg-teal-200 p-3 text-center outline-0 transition-colors duration-300 hover:bg-teal-300 focus:ring-2 focus:ring-yellow-400 dark:bg-grey-700 dark:hover:bg-grey-600"
                                    onClick={(e) => toggleCmdPalette()}
                                >
                                    <OutlineIcons.SearchIcon className="h-6 w-6 text-teal-500 transition-colors duration-500 dark:text-teal-500" />
                                    <span className="font-montserrat text-sm text-grey-800 transition-colors duration-500 dark:text-grey-50">
                                        Quick search...
                                    </span>
                                    <span className="font-montserrat text-xs text-grey-800 transition-colors duration-500 dark:text-grey-50">
                                        {Helpers.setOSKey()}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </Components.Section>
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
                        <Components.HTMLVideo
                            srcWebM="/video/webm/a_quick_introduction_to_octopus.webm"
                            srcMp4="/video/mp4/a_quick_introduction_to_octopus.mp4"
                            title="A quick introduction to Octopus: the new primary research record for science"
                            showCaption={false}
                            controls={true}
                            poster="/images/jpg/poster.jpg"
                            width={800}
                        />

                        <div>
                            <h3 className="mb-1 block font-montserrat text-base font-bold text-grey-800 dark:text-white">
                                Free and quick to publish
                            </h3>
                            <p className="mb-5 block text-sm text-grey-800 dark:text-white">
                                Octopus is designed to help researchers get their work published quickly, easily and
                                freely. Break away from the tyranny of &apos;papers&apos; and publish your work faster!
                            </p>
                            <h3 className="mb-1 block font-montserrat text-base font-bold text-grey-800 dark:text-white">
                                Establish your priority
                            </h3>
                            <p className="mb-5 block text-sm text-grey-800 dark:text-white">
                                No need to worry about being &apos;scooped&apos; - once you&apos;ve published an idea,
                                or a protocol in Octopus you have established your priority. That work now has your name
                                and date on it for everyone to see.
                            </p>
                            <h3 className="mb-1 block font-montserrat text-base font-bold text-grey-800 dark:text-white">
                                Find relevant work
                            </h3>
                            <p className="mb-5 block text-sm text-grey-800 dark:text-white">
                                All publications in Octopus are linked, forming branching chains. You can explore these
                                links from each publication page, or{' '}
                                <Components.Link href={Config.urls.browsePublications.path}>
                                    <span>browse</span>
                                </Components.Link>{' '}
                                content by type.
                            </p>
                            <h3 className="mb-1 block font-montserrat text-base font-bold text-grey-800 dark:text-white">
                                Get the credit you deserve
                            </h3>
                            <p className="mb-5 block text-sm text-grey-800 dark:text-white">
                                All your work in Octopus, including reviews that you write, are displayed on your
                                personal page for others to see, along with ratings that others have given them.
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
                                <OutlineIcons.DesktopComputerIcon className="mb-8 h-10 w-10 text-teal-500" />
                                <h3 className="mb-6 block font-montserrat text-lg font-bold text-grey-800 transition-colors duration-500 dark:text-white">
                                    Browse publications
                                </h3>
                                <p className="mb-8 block font-normal text-grey-800 transition-colors duration-500 dark:text-grey-50">
                                    Browse our most recent publications, and different types of publication. You
                                    don&apos;t need to log in.
                                </p>
                                <Components.ExtendedLink
                                    href={Config.urls.browsePublications.path}
                                    title="Browse publications"
                                />
                            </Components.Paper>
                            <Components.Paper>
                                <OutlineIcons.SearchIcon className="mb-8 h-10 w-10 text-teal-500" />
                                <h3 className="mb-6 block font-montserrat text-lg font-bold text-grey-800 transition-colors duration-500 dark:text-white">
                                    Search publications
                                </h3>
                                <p className="mb-8 block font-normal text-grey-800 transition-colors duration-500 dark:text-grey-50">
                                    Anyone can read any publication on Octopus. Search by keyword, title or author to
                                    discover more.
                                </p>
                                <Components.ExtendedLink href={Config.urls.search.path} title="Search publications" />
                            </Components.Paper>
                            <Components.Paper>
                                <OutlineIcons.PencilIcon className="mb-8 h-10 w-10 text-teal-500" />
                                <h3 className="mb-6 block font-montserrat text-lg font-bold text-grey-800 transition-colors duration-500 dark:text-white">
                                    Publish your work
                                </h3>
                                <p className="mb-8 block font-normal text-grey-800 transition-colors duration-500 dark:text-grey-50">
                                    Publishing in Octopus is free and simple, with eight publications types aligned with
                                    the scientific process.
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

                        <p className="block font-montserrat text-xl font-normal xl:w-1/2">
                            We&apos;re still developing the platform, and your comments will help us identify any issues
                            and opportunities for improvement.
                        </p>
                        <p className="mt-4 block font-montserrat text-xl font-normal xl:w-1/2">
                            Please complete our{' '}
                            <Components.Link
                                openNew={true}
                                href="https://forms.office.com/r/DhYd8AdHkx"
                                className="underline"
                            >
                                <span>feedback form</span>
                            </Components.Link>
                            .
                        </p>
                        <p className="mt-4 block font-montserrat text-xl font-normal xl:w-1/2">
                            If you&apos;d like to get more involved with platform development, do consider joining the
                            Octopus{' '}
                            <Components.Link
                                openNew={true}
                                href="https://www.jisc.ac.uk/get-involved/octopus-user-community"
                                className="underline"
                            >
                                <span>user community</span>
                            </Components.Link>
                            .
                        </p>
                    </div>
                </Components.SectionTwo>
            </Layouts.Standard>
        </>
    );
};

export default Home;
