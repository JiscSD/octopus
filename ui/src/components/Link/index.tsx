/* eslint-disable jsx-a11y/anchor-is-valid */ // Disabled due to NextLink using an anchor with an onClick
/* eslint-disable jsx-a11y/click-events-have-key-events */ // Disabled due to having an onClick & not a key event listener
import React from 'react';
import Link from 'next/link';

type Props = {
    id?: string;
    href: string;
    title?: string;
    className?: string;
    scroll?: boolean;
    openNew?: boolean;
    ariaLabel?: string;
    children: React.ReactChildren | React.ReactChild | React.ReactElement[];
    onClick?: () => void;
};

const CustomLink: React.FC<Props> = (props): React.ReactElement => (
    <Link href={props.href} scroll={props.scroll}>
        <a
            id={props.id}
            className={`rounded border-transparent outline-0 focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 ${
                props.className ? props.className : ''
            }`}
            target={props.openNew ? '_blank' : ''}
            title={props.title}
            rel={props.openNew ? 'noreferrer noopener' : ''}
            aria-label={props.ariaLabel}
            onClick={props.onClick}
            role="button"
            tabIndex={0}
        >
            {props.children}
        </a>
    </Link>
);

export default CustomLink;
