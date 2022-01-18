import { FC } from 'react';

import * as Layouts from '@layouts';

type Props = { statusCode: number; title: string; content: string };

const ErrorTemplate: FC<Props> = (props) => {
    return (
        <Layouts.Standard>
            <div>
                <h1>
                    {props.title} - {props.statusCode}
                </h1>
                <p>{props.content}</p>
            </div>
        </Layouts.Standard>
    );
};

export default ErrorTemplate;
