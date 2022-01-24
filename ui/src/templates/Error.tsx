import React from 'react';

import * as Layouts from '@layouts';
import * as Components from '@components';

type Props = { statusCode: number; title: string; content: string };

const ErrorTemplate: React.FC<Props> = (props) => {
    return (
        <Layouts.Standard>
            <Components.Section
                id='error'
                className='bg-teal-50 dark:bg-grey-800'
                waveFillTop='fill-teal-100 dark:fill-grey-500 transition-colors duration-500'
                waveFillMiddle='fill-teal-200 dark:fill-grey-600 transition-colors duration-500'
                waveFillBottom='fill-teal-300 dark:fill-grey-900 transition-colors duration-500'
            >
                <div className='container mx-auto px-8'>
                    <h1 className='block text-xl'>
                        {props.title}: {props.statusCode}
                    </h1>
                    <p>{props.content}</p>
                </div>
            </Components.Section>
        </Layouts.Standard>
    );
};

export default ErrorTemplate;
