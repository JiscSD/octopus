import { FC } from 'react';

import * as Layouts from '@layouts';
import * as Components from '@components';

type Props = { statusCode: number; title: string; content: string };

const ErrorTemplate: FC<Props> = (props) => {
    return (
        <Layouts.Standard>
            <Components.Section
                id='error'
                className='bg-purple-100 dark:bg-grey-600'
                wave={true}
                waveFill='fill-purple-100 dark:fill-grey-600'
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
