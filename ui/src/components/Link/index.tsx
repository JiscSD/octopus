import React from 'react';
import Link from 'next/link';

type Props = {
    href: string;
    className?: string;
    scroll?: boolean;
    openNew?: boolean;
    ariaLabel?: string;
    children: React.ReactChildren | React.ReactChild | React.ReactElement[];
    onClick?: () => void;
};

const CustomLink: React.FC<Props> = (props): JSX.Element => (
    <Link href={props.href} scroll={props.scroll}>
        <a
            className={`rounded border-transparent outline-0 focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 ${
                props.className ? props.className : ''
            }`}
            target={props.openNew ? '_blank' : ''}
            rel={props.openNew ? 'noreferrer noopener' : ''}
            aria-label={props.ariaLabel}
            onClick={props.onClick}
        >
            {props.children}
        </a>
    </Link>
);

export default CustomLink;
