import React from 'react';

import * as Layouts from '@layouts';
import * as Components from '@components';
import * as Config from '@config';

type Props = { statusCode: number; title: string; content: string };

const ErrorTemplate: React.FC<Props> = (props) => {
    return (
        <Layouts.Standard fixedHeader={true}>
            <section className="container mx-auto grid grid-cols-1 px-8 pt-8 lg:gap-4 lg:pt-48">
                <h1 className="mx-auto mt-8 mb-8 block text-center font-montserrat text-6xl font-bold leading-snug text-grey-900 transition-colors duration-500 dark:text-white lg:mt-2 lg:mb-4 lg:leading-none">
                    {props.title}
                </h1>
                <h2 className="mx-auto mb-4 block text-center font-inter text-2xl text-teal-900 transition-colors duration-500 dark:text-white">
                    {props.content}
                </h2>
                <div className="mx-auto my-12 block text-grey-800 transition-colors duration-500 dark:text-white">
                    <Components.ExtendedLink href={Config.urls.home.path} title="Navigate to homepage" />
                </div>
            </section>
        </Layouts.Standard>
    );
};

export default ErrorTemplate;
