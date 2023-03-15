import React from 'react';

import * as Components from '@components';

type Props = {
    text: string;
    required?: boolean;
    id?: string;
};

const StepTitle: React.FC<Props> = (props): React.ReactElement => (
    <h2
        id={props.id}
        className="mb-4 flex space-x-1 font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-100"
    >
        <span>{props.text}</span>
        {props.required && <Components.RequiredIndicator />}
    </h2>
);

export default StepTitle;
