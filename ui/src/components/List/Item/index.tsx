import React from 'react';

type Props = {
    className?: string;
    children: React.ReactElement[] | React.ReactElement;
};

const Item: React.FC<Props> = (props): JSX.Element => (
    <li className={`relative mb-1 flex ${props.className ? props.className : ''}`}>{props.children}</li>
);

export default Item;
