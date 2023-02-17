/* eslint-disable jsx-a11y/anchor-is-valid */ // Disabled due to NextLink using an anchor with an onClick
/* eslint-disable jsx-a11y/click-events-have-key-events */ // Disabled due to having an onClick & not a key event listener
import Link from 'next/link';
import React from 'react';

type Props = {
    href: string;
    title?: string;
    className?: string;
    scroll?: boolean;
    openNew?: boolean;
    ariaLabel?: string;
    children: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
};

const CustomLink: React.FC<Props> = (props): React.ReactElement => (
    <Link href={props.href} scroll={props.scroll}>
        <a
            className={`rounded border-transparent decoration-teal-500 underline-offset-2 outline-0 focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 ${
                props.className ? props.className : ''
            }`}
            target={props.openNew ? '_blank' : undefined}
            title={props.title}
            rel={props.openNew ? 'noreferrer noopener' : undefined}
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
