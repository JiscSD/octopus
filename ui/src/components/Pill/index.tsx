import React from 'react';

type Props = {
    className?: string;
    children: React.ReactElement | React.ReactText;
};

const Pill: React.FC<Props> = (props): React.ReactElement => {
    return (
        <span
            className={`flex rounded-full border-2 border-teal-500 px-2 py-1 text-xxs font-semibold uppercase leading-tight tracking-widest ${
                props.className ? props.className : ''
            }`}
        >
            {props.children}
        </span>
    );
};

export default Pill;
