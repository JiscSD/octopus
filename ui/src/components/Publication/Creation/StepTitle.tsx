import React from 'react';

type Props = {
    text: string;
};

const StepTitle: React.FC<Props> = (props): React.ReactElement => (
    <h2 className="mb-4 block font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-100">
        {props.text}
    </h2>
);

export default StepTitle;
