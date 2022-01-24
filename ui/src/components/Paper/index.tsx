import React from 'react';

type Props = {
    children: React.ReactElement | React.ReactElement[];
};

const Paper: React.FC<Props> = (props): JSX.Element => {
    return (
        <div className="py-8 px-6 bg-white dark:bg-grey-900 rounded-xl shadow-lg transition-colors duration-500">
            {props.children}
        </div>
    );
};

export default Paper;
