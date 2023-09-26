import React from 'react';
import Head from 'next/head';

import * as Assets from '@assets';
import * as Components from '@components';

const Maintenance: React.FC = () => (
    <>
        <Head>
            <meta name="robots" content="noindex, nofollow" key="robots" />
            <title>Site under maintenance</title>
        </Head>
        <main>
            <section className="container mx-auto grid grid-cols-1 px-8 pt-8 lg:gap-4 lg:pt-48">
                <h1 className="mx-auto mb-8 mt-8 block text-center font-montserrat text-6xl font-bold leading-snug text-grey-900 transition-colors duration-500 dark:text-white-50 lg:mb-4 lg:mt-2 lg:leading-none">
                    Site under maintenance
                </h1>
                <p className="mx-auto text-center font-inter text-2xl text-teal-900 transition-colors duration-500 dark:text-white-50 lg:mb-32">
                    {process.env.NEXT_PUBLIC_MAINTENANCE_MESSAGE ||
                        'Octopus is currently offline for maintenance. It should be back online soon, so please try again later.'}
                </p>
            </section>
        </main>
        <Components.Footer waves={true} />
    </>
);

export default Maintenance;
