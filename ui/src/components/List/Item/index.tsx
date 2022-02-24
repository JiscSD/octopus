import React from 'react';

type Props = {
    className?: string;
    children: React.ReactElement[] | React.ReactElement;
};

const Item: React.FC<Props> = (props): JSX.Element => (
    <li
        className={`relative mb-1 flex before:left-0 before:mr-2 before:inline-block before:font-bold before:text-teal-500 before:content-['\\2022'] ${
            props.className ? props.className : ''
        }`}
    >
        {props.children}
    </li>
);

export default Item;
