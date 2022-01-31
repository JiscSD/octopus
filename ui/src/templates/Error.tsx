import React from 'react';

import * as Layouts from '@layouts';
import * as Components from '@components';
import * as Config from '@config';

type Props = { statusCode: number; error: string; title: string; content: string };

const ErrorTemplate: React.FC<Props> = (props) => {
    return (
        <Layouts.Standard fixedHeader={true}>
            <Components.SectionTwo
                className="bg-teal-50 dark:bg-grey-800"
                waveFillTop="fill-teal-100 dark:fill-grey-500 transition-colors duration-500"
                waveFillMiddle="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                waveFillBottom="fill-teal-700 dark:fill-grey-800 transition-colors duration-500"
            >
                <section className="container mx-auto grid grid-cols-1 px-8 pt-8 lg:gap-4 lg:pt-36">
                    <Components.Pill className="mx-auto mt-20 mb-5 bg-teal-600 font-inter font-bold text-white transition-colors duration-500  dark:bg-teal-300 dark:text-grey-900 lg:my-5">
                        {props.error}
                    </Components.Pill>
                    <h1 className="mx-auto mb-8 block text-center font-montserrat text-6xl font-bold leading-snug text-grey-900 transition-colors duration-500 dark:text-white lg:mb-4 lg:leading-none">
                        {props.title}
                    </h1>
                    <h2 className="mx-auto mb-4 block text-center font-inter text-2xl text-teal-900 transition-colors duration-500 dark:text-white">
                        {props.content}
                    </h2>
                    <div className="mx-auto my-12 block text-grey-800 transition-colors duration-500 dark:text-white">
                        <Components.ExtendedLink href={Config.urls.home.path} title="Navigate to homepage" />
                    </div>
                </section>
            </Components.SectionTwo>
        </Layouts.Standard>
    );
};

export default ErrorTemplate;
