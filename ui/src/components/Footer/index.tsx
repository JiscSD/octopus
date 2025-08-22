import React from 'react';
import Image from 'next/image';

import * as Components from '@/components';
import * as Config from '@/config';
import * as Assets from '@/assets';
import * as SolidIcons from '@heroicons/react/24/solid';
import dynamic from 'next/dynamic';

const ScrollTopNoSSR = dynamic(() => import('../ScrollToTop'), { ssr: false });

type Props = {
    waves: boolean;
};

const linkClasses = 'mb-1 block max-w-fit p-1';
const linkInnerClasses = 'font-montserrat font-semibold text-white-50 dark:text-teal-200';

const Footer: React.FC<Props> = (props: Props): React.ReactElement => (
    <>
        {props.waves && (
            <Assets.Wave
                top="fill-teal-200 dark:fill-grey-600"
                middle="fill-teal-400 dark:fill-grey-700"
                bottom="fill-teal-700 dark:fill-grey-800"
            />
        )}
        <footer className="bg-teal-700 py-28 transition-all duration-500 dark:bg-grey-800 print:hidden">
            <div className="container mx-auto grid grid-cols-1 gap-8 px-8 md:grid-cols-4">
                {/** Title and social icons */}
                <h2 className="col-span-1 block font-montserrat text-4xl font-bold text-white-50 lg:mb-12">Octopus</h2>
                <div className="col-span-1 flex space-x-4 pt-4 md:col-span-3 lg:col-span-3">
                    <Components.Link
                        href="https://github.com/Jisc/octopus"
                        openNew={true}
                        ariaLabel="Github Repository"
                        className="h-fit"
                    >
                        <Assets.Github height={25} width={25} className="fill-white-50" />
                    </Components.Link>
                    <Components.Link
                        href="https://twitter.com/octopus_ac"
                        openNew={true}
                        ariaLabel="Twitter"
                        className="h-fit"
                    >
                        <Assets.Twitter width={25} height={25} className="fill-white-50" />
                    </Components.Link>
                    <Components.Link href="mailto:help@jisc.ac.uk" openNew={true} ariaLabel="Email" className="h-fit">
                        <SolidIcons.EnvelopeIcon width={26} height={26} className="fill-white-50" />
                    </Components.Link>
                </div>
                {/* contact us section */}
                <div className="col-span-1 mb-6 md:col-span-4">
                    <h3 className={linkInnerClasses}>
                        Contact us: <Components.Link href="mailto:help@jisc.ac.uk">help@jisc.ac.uk</Components.Link>
                    </h3>
                </div>
                {
                    /** Links */
                    process.env.NEXT_PUBLIC_MAINTENANCE_MODE !== 'true' && (
                        <>
                            <div className="col-span-1 mb-14 md:col-span-2 lg:col-span-1">
                                <Components.Link href={Config.urls.browsePublications.path} className={linkClasses}>
                                    <h3 className={linkInnerClasses}>Browse</h3>
                                </Components.Link>
                                <Components.Link href={Config.urls.createPublication.path} className={linkClasses}>
                                    <h3 className={linkInnerClasses}>Publish</h3>
                                </Components.Link>
                                <Components.Link href={Config.urls.about.path} className={linkClasses}>
                                    <h3 className={linkInnerClasses}>About</h3>
                                </Components.Link>
                                <Components.Link href={Config.urls.faq.path} className={linkClasses}>
                                    <h3 className={linkInnerClasses}>FAQs</h3>
                                </Components.Link>
                                <Components.Link href={Config.urls.getInvolved.path} className={linkClasses}>
                                    <h3 className={linkInnerClasses}>Get involved</h3>
                                </Components.Link>
                            </div>
                            <div className="col-span-1 mb-4 md:col-span-2 lg:col-span-3">
                                <Components.Link href={Config.urls.terms.path} className={linkClasses}>
                                    <h3 className={linkInnerClasses}>Terms</h3>
                                </Components.Link>
                                <Components.Link href={Config.urls.privacy.path} className={linkClasses}>
                                    <h3 className={linkInnerClasses}>Privacy</h3>
                                </Components.Link>
                                <Components.Link href={Config.urls.accessibility.path} className={linkClasses}>
                                    <h3 className={linkInnerClasses}>Accessibility</h3>
                                </Components.Link>
                                <Components.Link href={Config.urls.cookiePolicy.path} className={linkClasses}>
                                    <h3 className={linkInnerClasses}>Cookie Policy</h3>
                                </Components.Link>
                            </div>
                        </>
                    )
                }
                {/** Socket */}
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                    <h4 className="text-md mb-8 block font-montserrat text-sm font-bold text-white-50 dark:text-teal-200">
                        In partnership with
                    </h4>
                    <Components.Link href="https://www.ukrn.org/" openNew={true} className="flex w-fit">
                        <Image src="/images/ukrn.png" alt="Jisc Logo" width={60} height={60} />
                    </Components.Link>
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                    <h4 className="text-md mb-8 block font-montserrat text-sm font-bold text-white-50 dark:text-teal-200">
                        With support from
                    </h4>
                    <div className="flex">
                        <Components.Link href="https://www.ukri.org/" openNew={true} className="flex w-fit">
                            <Image
                                src="/images/logo-ukri.png"
                                alt="UKRI"
                                width={200}
                                height={64}
                                style={{ width: 200, height: 64 }} // removes strange next13 console warning...
                            />
                        </Components.Link>
                    </div>
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                    <h4 className="text-md mb-8 block font-montserrat text-sm font-bold text-white-50 dark:text-teal-200">
                        A collaboration with
                    </h4>
                    <div className="flex">
                        <Components.Link href="https://jisc.ac.uk" openNew={true} className="flex">
                            <Image src="/images/jisc-logo.svg" alt="Jisc Logo" width={60} height={60} />
                        </Components.Link>
                    </div>
                </div>
            </div>
            <ScrollTopNoSSR />
        </footer>
    </>
);

export default React.memo(Footer);
