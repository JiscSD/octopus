import React from 'react';
import Image from 'next/image';

import * as Components from '@components';
import * as Config from '@config';

const Footer: React.FC = (): JSX.Element => {
    return (
        <footer className="bg-teal-700 dark:bg-grey-800 pt-28 pb-12 transition-all duration-500">
            <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/** Title */}
                <h2 className="block lg:mb-12 font-montserrat font-bold text-4xl text-white col-span-1 md:col-span-4 lg:col-span-4">
                    Octopus
                </h2>
                {/** Links */}
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                    <Components.Link
                        href=""
                        className="block max-w-fit p-1 mb-1 rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                    >
                        <h3 className="font-montserrat font-semibold text-white dark:text-teal-200">Learn</h3>
                    </Components.Link>

                    <Components.Link
                        href=""
                        className="block max-w-fit p-1 mb-1 rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                    >
                        <h3 className="font-montserrat font-semibold text-white dark:text-teal-200">Browse</h3>
                    </Components.Link>
                    <Components.Link
                        href={Config.urls.search.path}
                        className="block max-w-fit p-1 mb-1 rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                    >
                        <h3 className="font-montserrat font-semibold text-white dark:text-teal-200">Search</h3>
                    </Components.Link>
                    <Components.Link
                        href={Config.urls.createPublication.path}
                        className="block max-w-fit p-1 mb-1 rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                    >
                        <h3 className="font-montserrat font-semibold text-white dark:text-teal-200">Publish</h3>
                    </Components.Link>
                </div>
                {/** Links */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <Components.Link
                        href=""
                        className="block max-w-fit p-1 mb-1 rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                    >
                        <h3 className="font-montserrat font-semibold text-white dark:text-teal-200">
                            Legal information
                        </h3>
                    </Components.Link>
                    <Components.Link
                        href=""
                        className="block max-w-fit p-1 mb-1 rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                    >
                        <h3 className="font-montserrat font-semibold text-white dark:text-teal-200">Privacy</h3>
                    </Components.Link>
                    <Components.Link
                        href=""
                        className="block max-w-fit p-1 mb-1 rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                    >
                        <h3 className="font-montserrat font-semibold text-white dark:text-teal-200">Leave feedback</h3>
                    </Components.Link>
                </div>
                {/** Socket */}
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                    <h4 className="block mb-8 font-montserrat font-bold text-sm text-md text-white dark:text-teal-200">
                        In partnership with
                    </h4>
                    <Components.Link
                        href="https://jisc.ac.uk"
                        openNew={true}
                        className="flex w-fit rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                    >
                        <Image src="/images/ukrn.png" alt="Jisc Logo" width={60} height={60} />
                    </Components.Link>
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                    <h4 className="block mb-8 font-montserrat font-bold text-sm text-md text-white dark:text-teal-200">
                        With support from
                    </h4>
                    <div className="flex">
                        <Components.Link
                            href="https://jisc.ac.uk"
                            openNew={true}
                            className="flex w-fit rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                        >
                            <Image src="/images/mozillaScienceLab.svg" alt="Jisc Logo" width={200} height={60} />
                        </Components.Link>
                    </div>
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                    <h4 className="block mb-8 font-montserrat font-bold text-sm text-md text-teal-400 dark:text-teal-200">
                        &nbsp;
                    </h4>
                    <div className="flex">
                        <Components.Link
                            href="https://jisc.ac.uk"
                            openNew={true}
                            className="flex w-fit  rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                        >
                            <Image src="/images/elife.svg" alt="Jisc Logo" width={200} height={70} />
                        </Components.Link>
                    </div>
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                    <h4 className="block mb-8 font-montserrat font-bold text-sm text-md text-white dark:text-teal-200">
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
