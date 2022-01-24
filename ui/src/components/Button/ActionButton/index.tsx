import React from 'react';

import * as Hooks from '@hooks';

type Props = {
    title: string;
    icon: React.ReactElement;
    callback: () => void;
    className?: string;
};

const ActionButton: React.FC<Props> = (props): JSX.Element => {
    const screens = Hooks.useWindowSize();

    return (
        <button
            type="button"
            onClick={() => props.callback()}
            className={`flex items-center group rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400 ${props.className}`}
        >
            {!screens.sm && (
                <span className="mr-2 p-2 font-montserrat font-semibold text-sm text-grey-800 group-hover:text-grey-400 dark:text-white dark:group-hover:text-grey-300 border-b-2 border-teal-500 group-hover:border-teal-700 transition-colors duration-500">
                    {props.title}
                </span>
            )}
            {props.icon}
        </button>
    );
};

export default ActionButton;
