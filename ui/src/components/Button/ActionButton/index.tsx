import React from 'react';

type Props = {
    title: string;
    icon: React.ReactElement;
    callback: () => void;
    className?: string;
};

const ActionButton: React.FC<Props> = (props): JSX.Element => {
    return (
        <button type="button" onClick={() => props.callback()} className={`flex items-center ${props.className}`}>
            <span className="mr-2 p-2 font-montserrat font-semibold text-grey-800 dark:text-white border-b-2 border-teal-500 transition-colors duration-500">
                {props.title}
            </span>
            {props.icon}
        </button>
    );
};

export default ActionButton;
