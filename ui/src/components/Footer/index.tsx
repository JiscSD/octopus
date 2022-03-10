import React from 'react';
import Image from 'next/image';

import * as Components from '@components';
import * as Config from '@config';

const Footer: React.FC = (): JSX.Element => (
    <footer className="bg-teal-700 pt-28 pb-12 transition-all duration-500 dark:bg-grey-800 print:hidden">
        <div className="container mx-auto grid grid-cols-1 gap-8 px-8 md:grid-cols-4">
            {/** Title and social icons */}
            <h2 className="col-span-1 block font-montserrat text-4xl font-bold text-white lg:mb-12">Octopus</h2>
            <div className="col-span-1 flex max-h-[40px] gap-4 pt-3 md:col-span-3 lg:col-span-3">
                <Components.Link
                    href="https://github.com/JiscSD/octopus"
                    openNew={true}
                    ariaLabel="Github Repository"
                    className="flex w-fit rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                >
                    <svg height="25" width="25" aria-hidden="true" viewBox="0 0 16 16" className="fill-white">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                    </svg>
                </Components.Link>
                <Components.Link
                    href="https://twitter.com/science_octopus"
                    openNew={true}
                    ariaLabel="Twitter"
                    className="flex w-fit rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                >
                    <svg height="25" width="25" viewBox="0 0 24 24" aria-hidden="true" className="fill-white">
                        <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
                    </svg>
                </Components.Link>
            </div>
            {/** Links */}
            <div className="col-span-1 mb-14 md:col-span-2 lg:col-span-1">
                <Components.Link
                    href={Config.urls.browsePublications.path}
                    className="mb-1 block max-w-fit rounded border-transparent p-1 outline-0 focus:ring-2 focus:ring-yellow-400"
                >
                    <h3 className="font-montserrat font-semibold text-white dark:text-teal-200">Browse</h3>
                </Components.Link>
                <Components.Link
                    href={Config.urls.createPublication.path}
                    className="mb-1 block max-w-fit rounded border-transparent p-1 outline-0 focus:ring-2 focus:ring-yellow-400"
                >
                    <h3 className="font-montserrat font-semibold text-white dark:text-teal-200">Publish</h3>
                </Components.Link>
                <Components.Link
                    href={Config.urls.about.path}
                    className="mb-1 block max-w-fit rounded border-transparent p-1 outline-0 focus:ring-2 focus:ring-yellow-400"
                >
                    <h3 className="font-montserrat font-semibold text-white dark:text-teal-200">About</h3>
                </Components.Link>
                <Components.Link
                    href={Config.urls.faq.path}
                    className="mb-1 block max-w-fit rounded border-transparent p-1 outline-0 focus:ring-2 focus:ring-yellow-400"
                >
                    <h3 className="font-montserrat font-semibold text-white dark:text-teal-200">FAQs</h3>
                </Components.Link>
            </div>
            {/** Links */}
            <div className="col-span-1 mb-4 md:col-span-2 lg:col-span-3">
                <Components.Link
                    href={Config.urls.terms.path}
                    className="mb-1 block max-w-fit rounded border-transparent p-1 outline-0 focus:ring-2 focus:ring-yellow-400"
                >
                    <h3 className="font-montserrat font-semibold text-white dark:text-teal-200">Terms</h3>
                </Components.Link>
                <Components.Link
                    href={Config.urls.privacy.path}
                    className="mb-1 block max-w-fit rounded border-transparent p-1 outline-0 focus:ring-2 focus:ring-yellow-400"
                >
                    <h3 className="font-montserrat font-semibold text-white dark:text-teal-200">Privacy</h3>
                </Components.Link>
                <Components.Link
                    href={Config.urls.accessibility.path}
                    className="mb-1 block max-w-fit rounded border-transparent p-1 outline-0 focus:ring-2 focus:ring-yellow-400"
                >
                    <h3 className="font-montserrat font-semibold text-white dark:text-teal-200">Accessibility</h3>
                </Components.Link>
            </div>
            {/** Socket */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <h4 className="text-md mb-8 block font-montserrat text-sm font-bold text-white dark:text-teal-200">
                    In partnership with
                </h4>
                <Components.Link
                    href="https://www.ukrn.org/"
                    openNew={true}
                    className="flex w-fit rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                >
                    <Image src="/images/ukrn.png" alt="Jisc Logo" width={60} height={60} />
                </Components.Link>
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <h4 className="text-md mb-8 block font-montserrat text-sm font-bold text-white dark:text-teal-200">
                    With support from
                </h4>
                <div className="flex">
                    <Components.Link
                        href="https://www.ukri.org/"
                        openNew={true}
                        className="flex w-fit rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                    >
                        <Image src="/images/logo-ukri.png" alt="UKRI" width={200} height={64} />
                    </Components.Link>
                </div>
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <h4 className="text-md mb-8 block font-montserrat text-sm font-bold text-white dark:text-teal-200">
                    A collaboration with
                </h4>
                <Components.Link
                    href="https://jisc.ac.uk"
                    openNew={true}
                    className="mr-4 rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                >
                    <Image src="/images/jisc-logo.svg" alt="Jisc Logo" width={60} height={60} />
                </Components.Link>
                <Components.Link
                    href="https://science-octopus.org/"
                    openNew={true}
                    className="rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                >
                    <Image src="/meta/octopus.svg" alt="Octopus logo" width={60} height={60} />
                </Components.Link>
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <h4 className="text-md mb-8 block font-montserrat text-sm font-bold text-teal-400 dark:text-teal-200">
                    &nbsp;
                </h4>
                <div className="flex"></div>
            </div>
        </div>
    </footer>
);

export default Footer;
