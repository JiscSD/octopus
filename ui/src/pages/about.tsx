import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Config from '@config';

const About: NextPage = (): React.ReactElement => (
    <>
        <Head>
            <meta name="description" content={Config.urls.about.description} />
            <meta name="keywords" content={Config.urls.about.keywords.join(', ')} />
            <link rel="canonical" href={Config.urls.about.canonical} />
            <title>{Config.urls.about.title}</title>
        </Head>

        <Layouts.Standard fixedHeader={false}>
            <section className="container px-8 lg:mx-auto lg:pt-24">
                <h1 className="mb-10 block text-center font-montserrat text-3xl font-black !leading-tight tracking-tight text-grey-700 transition-colors duration-500 dark:text-white-50 lg:text-5xl ">
                    Learn about Octopus.
                </h1>
                <h2 className="mx-auto mb-10 block text-center font-montserrat text-xl font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100 lg:text-2xl">
                    A new way to publish your scientific work that is fast, free and fair.
                </h2>
            </section>

            <Components.LearnAboutOctopus />

            <section className="container mx-auto my-16 px-8 2xl:my-36">
                <ul className="mx-auto 2xl:w-8/12">
                    <li className="mb-8 flex items-start gap-4 font-montserrat text-lg leading-relaxed text-grey-700 transition-colors duration-500 dark:text-white-50 lg:pl-6">
                        <OutlineIcons.EyeIcon className="mr-4 hidden w-8 pt-2 text-grey-500 transition-colors duration-500 dark:text-white-50 lg:block" />
                        <span>
                            Easy for institutions and funders to see exactly what you&apos;ve done and how it has been
                            regarded by others.
                        </span>
                    </li>
                    <li className="mb-8 flex items-start gap-4 font-montserrat text-lg leading-relaxed text-grey-700 transition-colors duration-500 dark:text-white-50 lg:pl-6">
                        <OutlineIcons.SparklesIcon className="mr-4 hidden w-8 pt-2 text-grey-500 transition-colors duration-500 dark:text-white-50 lg:block" />
                        <span>
                            Designed to recognise and reward good practice and serves the needs of both researchers and
                            the global research endeavour itself.
                        </span>
                    </li>
                    <li className="mb-8 flex items-start gap-4 font-montserrat text-lg leading-relaxed text-grey-700 transition-colors duration-500 dark:text-white-50 lg:pl-6">
                        <OutlineIcons.UserCircleIcon className="mr-4 hidden w-8 pt-2 text-grey-500 transition-colors duration-500 dark:text-white-50 lg:block" />
                        <span>
                            Free for researchers to publish their work, free for anyone to read and embeds the
                            principles of openness and transparency throughout.
                        </span>
                    </li>
                    <li className="mb-20 flex items-start gap-4 font-montserrat text-lg leading-relaxed text-grey-700 transition-colors duration-500 dark:text-white-50 lg:pl-6">
                        <OutlineIcons.ShareIcon className="mr-4 hidden w-8 pt-2 text-grey-500 transition-colors duration-500 dark:text-white-50 lg:block" />
                        <span>
                            Work can be shared in full detail with no &apos;spin&apos;, encouraging a new culture of
                            collaboration and constructive critique.
                        </span>
                    </li>
                </ul>
            </section>

            <section className="container mx-auto mb-36 px-8 2xl:px-36">
                <div className="mb-28">
                    <Components.PageSubTitle text="What makes Octopus different?" className="text-center" />
                    <h3 className="mb-6 text-center font-montserrat text-lg font-semibold leading-relaxed text-grey-700 transition-colors duration-500 dark:text-white-50 lg:mb-4 lg:text-xl">
                        Smaller units of publication encourage faster sharing, easier publication writing, and smaller
                        author groups.
                    </h3>
                    <p className="text-center text-base text-grey-700 transition-colors duration-500 dark:text-white-50 lg:mb-12 lg:text-lg">
                        Allowing researchers to get more meaningful credit for what they&apos;ve done.
                    </p>
                </div>
                <Components.VisualPublicationFlow />
            </section>

            <section className="container mx-auto px-8 lg:mb-6">
                <div className="mx-auto mb-2 flex flex-col items-center gap-1 font-montserrat text-base font-semibold uppercase tracking-wide text-grey-900 transition-colors duration-500 dark:text-white-50 lg:text-xl">
                    <OutlineIcons.UserCircleIcon className="mb-2 h-6 w-6 rounded-full bg-teal-500 p-1 text-white-50 shadow transition-colors duration-500" />
                    Peer Review
                </div>
                <div className="mx-auto block w-10/12 text-center text-sm leading-6 tracking-wide text-grey-700 transition-colors duration-500 dark:text-grey-200 lg:w-5/12 lg:text-base">
                    BETTER TEXT IS REQUIRED HERE ON WHY PEER REVIEWS ARE DIFFERENT, NOT THE SAME TEXT AS ABOVE.
                </div>
            </section>

            <section className="container mx-auto mb-10 px-8 py-32 pb-10 text-grey-900 dark:text-white-50 lg:mb-2">
                <Components.PageSubTitle text="Principles of Octopus" />

                <ul className="mb-16 space-y-4">
                    <li className="flex items-center">
                        <OutlineIcons.LightBulbIcon className="mr-4 hidden h-6 w-6 text-grey-800 transition-colors duration-500 dark:text-white-50 lg:block" />
                        <span className="pt-1 font-montserrat lg:text-lg">
                            Knowledge should not be locked behind paywalls.
                        </span>
                    </li>
                    <li className="flex items-center">
                        <OutlineIcons.LightBulbIcon className="mr-4 hidden h-6 w-6 text-grey-800 transition-colors duration-500 dark:text-white-50 lg:block" />
                        <span className="pt-1 font-montserrat lg:text-lg">
                            New ideas and findings should be shared as quickly as possible.
                        </span>
                    </li>
                    <li className="flex items-center">
                        <OutlineIcons.LightBulbIcon className="mr-4 hidden h-6 w-6 text-grey-800 transition-colors duration-500 dark:text-white-50 lg:block" />
                        <span className="pt-1 font-montserrat lg:text-lg">
                            Work should be accessible for people to share and read, regardless of the languages they
                            speak.
                        </span>
                    </li>
                    <li className="flex items-center">
                        <OutlineIcons.LightBulbIcon className="mr-4 hidden h-6 w-6 text-grey-800 transition-colors duration-500 dark:text-white-50 lg:block" />
                        <span className="pt-1 font-montserrat lg:text-lg">
                            Work should be judged on its merits, not on how good a &apos;story&apos; researchers can
                            write about it.
                        </span>
                    </li>
                </ul>

                <p className="mb-2 font-montserrat text-lg font-medium leading-relaxed text-grey-900 transition-colors duration-500 dark:text-white-50">
                    Do you feel like these principles align with your own?
                </p>
                <p className="mb-12 font-montserrat leading-relaxed text-grey-900 transition-colors duration-500 dark:text-white-50">
                    You can help to support Octopus by joining our user community.
                </p>
                <Components.Button
                    link
                    href="#"
                    title="Join our user community"
                    iconPosition="RIGHT"
                    icon={
                        <OutlineIcons.ExternalLinkIcon className="h-4 w-4 text-teal-500 transition-colors duration-500 dark:text-white-50" />
                    }
                />
            </section>

            <section className="container mx-auto px-8 pt-10 lg:pt-20">
                <Components.PageSubTitle text="How do I use Octopus?" className="text-center" />

                <div className="mx-auto mb-24 grid gap-8 lg:my-24 lg:grid-cols-4">
                    <div className="mx-auto text-center lg:col-start-2 lg:col-end-3">
                        <OutlineIcons.DesktopComputerIcon className="mx-auto mb-4 h-8 w-8 text-teal-500 dark:text-white-50" />
                        <h3 className="mb-4 block font-montserrat text-lg font-bold text-grey-800 transition-colors duration-500 dark:text-white-50">
                            To read publications
                        </h3>
                        <p className="mb-8 block font-normal text-grey-800 transition-colors duration-500 dark:text-grey-50">
                            Anyone can read any Octopus publication, you don&apos;t need to log in.
                        </p>
                        <Components.Button
                            href={Config.urls.browsePublications.path}
                            title="Browse publications"
                            link
                        />
                    </div>

                    <div className="mx-auto text-center lg:col-start-3 lg:col-end-3">
                        <OutlineIcons.PencilIcon className="mx-auto mb-4 h-8 w-8 text-teal-500 dark:text-white-50" />
                        <h3 className="mb-4 block font-montserrat text-lg font-bold text-grey-800 transition-colors duration-500 dark:text-white-50">
                            To write publications
                        </h3>
                        <p className="mb-8 block font-normal text-grey-800 transition-colors duration-500 dark:text-grey-50">
                            Log in via your ORCiD account in order to write and review publications.
                        </p>
                        <Components.Button href={Config.urls.createPublication.path} title="Publish your work" link />
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-8 pb-20 lg:py-20">
                <div className="space-y-16 2xl:px-28">
                    <div>
                        <OutlineIcons.StarIcon className="col-span-1 mt-1 block h-8 w-8 fill-yellow-200 text-grey-900 transition-colors duration-500 dark:fill-yellow-500 dark:text-white-50 lg:mr-4" />
                        <h3 className="my-4 font-montserrat text-lg font-semibold text-grey-800 transition-colors duration-500 dark:text-white-50">
                            Every publication you write (including reviews) can be rated by others.
                        </h3>
                        <p className="text-grey-600 transition-colors duration-500 dark:text-grey-100 2xl:w-2/3">
                            Your activity, including publications, reviews and ratings, will appear on your individual
                            author page for everyone to see. Publishing promptly and well, and contributing to the
                            community through constructive reviewing, is therefore rewarded.
                        </p>
                    </div>

                    <div>
                        <OutlineIcons.FlagIcon className="col-span-1 mt-1 block h-8 w-8 fill-peach-300 text-grey-900 transition-colors duration-500 dark:text-white-50 lg:mr-4" />
                        <h3 className="my-4 font-montserrat text-lg font-semibold text-grey-800 transition-colors duration-500 dark:text-white-50">
                            To ensure academic integrity concerns, any publication can be &apos;red flagged&apos; by a
                            logged-in user.
                        </h3>
                        <p className="text-grey-600 transition-colors duration-500 dark:text-grey-100 2xl:w-2/3">
                            This red flag will be visible on the publication page and will alert the authors to allow
                            them to resolve any issues. Once the issue is resolved, the red flag can be removed by the
                            initiating user.
                        </p>
                    </div>
                </div>
            </section>
        </Layouts.Standard>
    </>
);

export default About;
