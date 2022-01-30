import React from 'react';

import * as Layouts from '@layouts';
import * as Components from '@components';

type Props = { statusCode: number; title: string; content: string };

const ErrorTemplate: React.FC<Props> = (props) => {
    return (
        <Layouts.Standard fixedHeader={true}>
            <Components.SectionTwo
                className="bg-teal-50 dark:bg-grey-800"
                waveFillTop="fill-teal-100 dark:fill-grey-500 transition-colors duration-500"
                waveFillMiddle="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                waveFillBottom="fill-teal-700 dark:fill-grey-800 transition-colors duration-500"
            >
                <section className="container mx-auto grid grid-cols-1 px-8 pt-8 lg:grid-cols-3 lg:gap-4 lg:pt-36">
                    <h1>{props.title}</h1>
                    <p>{props.content}</p>
                </section>
            </Components.SectionTwo>
        </Layouts.Standard>
    );
};

export default ErrorTemplate;
