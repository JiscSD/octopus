import React from 'react';
import Image from 'next/image';

import * as Components from '@components';
import * as Config from '@config';

const Footer: React.FC = (): JSX.Element => {
    return (
        <footer className="bg-teal-700 pt-28 pb-12 transition-all duration-500 dark:bg-grey-800 print:hidden">
            <div className="container mx-auto grid grid-cols-1 gap-8 px-8 md:grid-cols-4">
                {/** Title */}
                <h2 className="col-span-1 block font-montserrat text-4xl font-bold text-white md:col-span-4 lg:col-span-4 lg:mb-12">
                    Octopus
                </h2>
                {/** Links */}
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                    {/* <Components.Link
                        href=""
                        className="mb-1 block max-w-fit rounded border-transparent p-1 outline-0 focus:ring-2 focus:ring-yellow-400"
                    >
                        <h3 className="font-montserrat font-semibold text-white dark:text-teal-200">Learn</h3>
                    </Components.Link> */}

                    <Components.Link
                        href={Config.urls.browsePublications.path}
                        className="mb-1 block max-w-fit rounded border-transparent p-1 outline-0 focus:ring-2 focus:ring-yellow-400"
                    >
                        <h3 className="font-montserrat font-semibold text-white dark:text-teal-200">Browse</h3>
                    </Components.Link>
                    <Components.Link
                        href={Config.urls.search.path}
                        className="mb-1 block max-w-fit rounded border-transparent p-1 outline-0 focus:ring-2 focus:ring-yellow-400"
                    >
                        <h3 className="font-montserrat font-semibold text-white dark:text-teal-200">Search</h3>
                    </Components.Link>
                    <Components.Link
                        href={Config.urls.createPublication.path}
                        className="mb-1 block max-w-fit rounded border-transparent p-1 outline-0 focus:ring-2 focus:ring-yellow-400"
                    >
                        <h3 className="font-montserrat font-semibold text-white dark:text-teal-200">Publish</h3>
                    </Components.Link>
                </div>
                {/** Links */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <Components.Link
                        href={Config.urls.legal.path}
                        className="mb-1 block max-w-fit rounded border-transparent p-1 outline-0 focus:ring-2 focus:ring-yellow-400"
                    >
                        <h3 className="font-montserrat font-semibold text-white dark:text-teal-200">
                            Legal information
                        </h3>
                    </Components.Link>
                    <Components.Link
                        href={Config.urls.privacy.path}
                        className="mb-1 block max-w-fit rounded border-transparent p-1 outline-0 focus:ring-2 focus:ring-yellow-400"
                    >
                        <h3 className="font-montserrat font-semibold text-white dark:text-teal-200">Privacy</h3>
                    </Components.Link>
                    <Components.Link
                        href={Config.urls.feedback.path}
                        className="mb-1 block max-w-fit rounded border-transparent p-1 outline-0 focus:ring-2 focus:ring-yellow-400"
                    >
                        <h3 className="font-montserrat font-semibold text-white dark:text-teal-200">Leave feedback</h3>
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
                            href="https://wiki.mozilla.org/ScienceLab"
                            openNew={true}
                            className="flex w-fit rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                        >
                            <Image src="/images/mozillaScienceLab.svg" alt="Jisc Logo" width={200} height={60} />
                        </Components.Link>
                    </div>
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                    <h4 className="text-md mb-8 block font-montserrat text-sm font-bold text-teal-400 dark:text-teal-200">
                        &nbsp;
                    </h4>
                    <div className="flex">
                        <Components.Link
                            href="https://elifesciences.org/"
                            openNew={true}
                            className="flex w-fit  rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                        >
                            <Image src="/images/elife.svg" alt="Jisc Logo" width={200} height={70} />
                        </Components.Link>
                    </div>
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                    <h4 className="text-md mb-8 block font-montserrat text-sm font-bold text-white dark:text-teal-200">
                        A collaboration between
                    </h4>
                    <Components.Link
                        href="https://jisc.ac.uk"
                        openNew={true}
                        className="flex w-fit rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                    >
                        <Image src="/images/jisc-logo.svg" alt="Jisc Logo" width={60} height={60} />
                    </Components.Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
