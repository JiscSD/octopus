import { NextPage } from 'next';
import Head from 'next/head';

import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Assets from '@assets';

type Props = {
    aboutSections: string[];
};

const About: NextPage<Props> = (props): JSX.Element => {
    const aboutSections = [
        'What is Octopus?',
        'Take some quick lessons',
        'Why publish in Octopus?',
        'What makes Octopus different?',
        'How to publish in Octopus',
        'Peer review and quality control',
        'Frequently asked questions'
    ];

    const heroContents = [
        {
            heading: 'Publish freely',
            content:
                'Upload your publications when they are done. No need to wait around until you have a full scientific paper ready.'
        },
        {
            heading: 'Establish priority',
            content: 'Stake your claim on an idea early, and establish your interests.'
        },
        {
            heading: 'Get quick peer reviews',
            content: 'Scientific ideas and findings should be shared as quickly as possible.'
        },
        {
            heading: 'Meritocracy',
            content:
                'Scientific work should be judged on its merits, and not on how good a "story" it tells: and so should scientific researchers.'
        }
    ];

    return (
        <>
            <Head>
                <meta name="description" content="About Octopus" />
                <meta name="keywords" content="Octopus" />
                <link rel="canonical" href={`${Config.urls.about.canonical}`} />
                <title>{Config.urls.about.title}</title>
            </Head>

            <Layouts.Standard fixedHeader={true}>
                <Components.Section
                    className="bg-teal-600 dark:bg-grey-800"
                    waveFillTop="fill-teal-200 dark:fill-grey-500 transition-colors duration-500"
                    waveFillMiddle="fill-teal-100 dark:fill-grey-600 transition-colors duration-500"
                    waveFillBottom="fill-teal-50 dark:fill-grey-800 transition-colors duration-500"
                >
                    <section className="container mx-auto px-8 py-8 lg:gap-4 lg:pt-36">
                        <div className="container mx-auto gap-6 px-8 py-16 text-white">
                            <h1 className="ml-52 block font-montserrat text-2xl font-bold leading-tight text-white transition-colors duration-500 md:text-3xl lg:mb-4 xl:text-4xl xl:leading-normal">
                                Learn about Octopus
                            </h1>
                            <div className="container mx-auto max-w-max gap-6 px-8 py-16 text-white">
                                <Components.HTMLVideo
                                    srcWebM="/video/webm/a_quick_introduction_to_octopus.webm"
                                    srcMp4="/video/mp4/a_quick_introduction_to_octopus.mp4"
                                    title="A quick introduction to Octopus: the new primary research record for science"
                                    showCaption={false}
                                    controls={true}
                                    poster="/images/jpg/poster.jpg"
                                    width={800}
                                />
                            </div>

                            <div className="m-auto grid max-w-6xl grid-cols-4 gap-10">
                                {heroContents.map((heroContent) => (
                                    <div key={heroContent.heading}>
                                        <h2 className="mb-2 block font-montserrat text-xl font-bold ">
                                            {heroContent.heading}
                                        </h2>
                                        <p className="mb-10 block text-base ">{heroContent.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </Components.Section>
                <Components.SectionTwo
                    className="bg-teal-50 dark:bg-grey-800"
                    waveFillTop="fill-teal-100 dark:fill-grey-500 transition-colors duration-500"
                    waveFillMiddle="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                    waveFillBottom="fill-teal-700 dark:fill-grey-800 transition-colors duration-500"
                >
                    <div className="container mx-auto gap-6 px-8 py-16">
                        <h1 className="block font-montserrat text-2xl font-bold leading-tight text-grey-800 transition-colors duration-500 dark:text-white md:text-3xl lg:mb-8 xl:text-4xl xl:leading-normal">
                            More about Octopus
                        </h1>
                    </div>
                    <main id="content" className="container mx-auto grid grid-cols-1 px-8 lg:grid-cols-8 lg:gap-16">
                        <aside className="relative col-span-2 hidden lg:block">
                            <div className="sticky top-28">
                                <h2 className="mb-2 block font-montserrat font-semibold text-grey-800 transition-colors duration-500 dark:text-white">
                                    Jump to:
                                </h2>
                                {aboutSections.map((aboutSection) => (
                                    <Components.Link
                                        key={aboutSection}
                                        href={`${Config.urls.home.path}`}
                                        className="group mb-2 block w-fit rounded border-transparent outline-0 hover:underline focus:ring-2 focus:ring-yellow-400"
                                    >
                                        <span className="text-grey-800 transition-colors duration-500 group-hover:text-grey-500 dark:text-grey-50">
                                            {aboutSection}
                                        </span>
                                    </Components.Link>
                                ))}
                            </div>
                        </aside>
                        <section className="lg:col-span-6">
                            <div className="container mx-auto px-8 py-16 text-grey-900 dark:text-white lg:py-12">
                                <h2 className="mb-6 block font-montserrat text-2xl font-bold lg:col-span-2 xl:mb-8">
                                    What is Octopus?
                                </h2>
                                <h3 className="mb-6 block font-inter text-xl xl:mb-12 xl:w-1/2">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                                    irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                                    deserunt mollit anim id est laborum.
                                </h3>
                            </div>
                            <div className="container mx-auto px-8 py-16 text-grey-900 dark:text-white lg:py-12">
                                <h2 className="mb-6 block font-montserrat text-2xl font-bold lg:col-span-2 xl:mb-8">
                                    Why publish in Octopus?
                                </h2>
                                <h3 className="mb-6 block font-inter text-xl xl:mb-12 xl:w-1/2">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                                    irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                                    deserunt mollit anim id est laborum.{' '}
                                </h3>
                            </div>
                            <div className="container mx-auto px-8 py-16 text-grey-900 dark:text-white lg:py-12">
                                <h2 className="mb-6 block font-montserrat text-2xl font-bold lg:col-span-2 xl:mb-8">
                                    What makes Octopus different?
                                </h2>
                                <h3 className="mb-6 block font-inter text-xl xl:mb-12 xl:w-1/2">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                                    irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                                    deserunt mollit anim id est laborum.
                                </h3>
                                <Assets.Logo
                                    height={100}
                                    width={100}
                                    className="mb-10 mr-4 fill-black transition-colors duration-500 dark:fill-teal-600"
                                />
                                <h3 className="mb-6 block font-inter text-xl xl:mb-12 xl:w-1/2">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                                    irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                                    deserunt mollit anim id est laborum.
                                </h3>
                            </div>
                            <div className="container mx-auto px-8 py-16 text-grey-900 dark:text-white lg:py-12">
                                <h2 className="mb-6 block font-montserrat text-2xl font-bold lg:col-span-2 xl:mb-8">
                                    How to publish in Octopus?
                                </h2>
                                <h3 className="mb-6 block font-inter text-xl xl:mb-12 xl:w-1/2">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                                    irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                                    deserunt mollit anim id est laborum.{' '}
                                </h3>
                            </div>
                            <div className="container mx-auto px-8 py-16 text-grey-900 dark:text-white lg:py-12">
                                <h2 className="mb-6 block font-montserrat text-2xl font-bold lg:col-span-2 xl:mb-8">
                                    Peer review and quality control
                                </h2>
                                <h3 className="mb-6 block font-inter text-xl xl:mb-12 xl:w-1/2">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                                    irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                                    deserunt mollit anim id est laborum.{' '}
                                </h3>
                            </div>
                            <div className="container mx-auto px-8 py-16 text-grey-900 dark:text-white lg:py-12">
                                <h2 className="mb-6 block font-montserrat text-2xl font-bold lg:col-span-2 xl:mb-8">
                                    Frequently asked questions
                                </h2>
                            </div>
                        </section>
                    </main>
                </Components.SectionTwo>
            </Layouts.Standard>
        </>
    );
};

export default About;
