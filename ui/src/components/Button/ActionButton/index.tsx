import React from 'react';

type Props = {
    title: string;
    icon?: React.ReactElement;
    callback: (e: React.MouseEvent) => void;
    disabled?: boolean;
    className?: string;
};

const ActionButton: React.FC<Props> = (props): JSX.Element => (
    <button
        type="button"
        onClick={(e) => props.callback(e)}
        disabled={props.disabled}
        className={`group flex items-center rounded border-transparent outline-0 hover:cursor-pointer focus:ring-2 focus:ring-yellow-400 disabled:select-none disabled:opacity-50 disabled:hover:cursor-not-allowed ${
            props.className ? props.className : ''
        }`}
    >
        <span className="mr-2 border-b-2 border-teal-500 p-2 font-montserrat text-sm font-semibold text-grey-800 transition-colors duration-500 group-hover:border-teal-700 group-hover:text-grey-400 dark:text-white dark:group-hover:text-grey-300">
            {props.title}
        </span>
        {props.icon}
    </button>
);

export default ActionButton;
