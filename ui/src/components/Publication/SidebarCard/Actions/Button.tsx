import React from 'react';

type Props = {
    label: string;
    onClick: () => void;
};

const Button: React.FC<Props> = (props): React.ReactElement => (
    <button
        aria-label={props.label}
        onClick={props.onClick}
        className="flex items-center rounded border-transparent text-left text-sm font-medium text-teal-600 outline-0 transition-colors duration-500 hover:underline focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 dark:text-teal-400"
    >
        {props.label}
    </button>
);

export default Button;
