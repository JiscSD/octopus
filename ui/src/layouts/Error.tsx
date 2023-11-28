import React from 'react';
import Head from 'next/head';
import * as OutlineIcons from '@heroicons/react/24/outline';

import * as Components from '@/components';
import * as Layouts from '@/layouts';
import * as Config from '@/config';

type Props = {
    title: string;
    windowTitle: string;
    content: string;
    statusCode: number;
};

const Error: React.FC<Props> = (props) => (
    <>
        <Head>
            <meta name="robots" content="noindex, nofollow" />
            <title>{props.windowTitle}</title>
        </Head>
        <Layouts.Standard fixedHeader={true}>
            <section className="container mx-auto grid grid-cols-1 px-8 pt-8 lg:gap-4 lg:pt-48">
                <h1 className="mx-auto mb-8 mt-8 block text-center font-montserrat text-6xl font-bold leading-snug text-grey-900 transition-colors duration-500 dark:text-white-50 lg:mb-4 lg:mt-2 lg:leading-none">
                    {props.title}
                </h1>
                <h2 className="error-message-e2e mx-auto mb-4 block text-center font-inter text-2xl text-teal-900 transition-colors duration-500 dark:text-white-50">
                    {props.content}
                </h2>
                <div className="mx-auto my-12 block text-grey-800 transition-colors duration-500 dark:text-white-50">
                    <Components.Button
                        href={Config.urls.home.path}
                        title="Navigate to homepage"
                        startIcon={
                            <OutlineIcons.HomeIcon className="h-5 w-5 text-grey-800 transition-colors duration-500 dark:text-white-50" />
                        }
                    />
                </div>
            </section>
        </Layouts.Standard>
    </>
);

export default Error;
