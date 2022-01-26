import React from 'react';

type Props = {
    children: React.ReactElement | React.ReactElement[];
};

const Paper: React.FC<Props> = (props): JSX.Element => {
    return (
        <div className="rounded-xl bg-white py-8 px-6 shadow-lg transition-colors duration-500 dark:bg-grey-900">
            {props.children}
        </div>
    );
};

export default Paper;
