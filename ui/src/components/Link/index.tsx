import React from 'react';
import Link from 'next/link';

type Props = {
    href: string;
    className?: string;
    scroll?: boolean;
    openNew?: boolean;
    ariaLabel?: string;
    children: React.ReactElement[] | React.ReactElement;
};

const CustomLink: React.FC<Props> = (props): JSX.Element => {
    return (
        <Link href={props.href} scroll={props.scroll}>
            <a
                className={props.className}
                target={props.openNew ? '_blank' : ''}
                rel={props.openNew ? 'noreferrer noopener' : ''}
                aria-label={props.ariaLabel}
            >
                {props.children}
            </a>
        </Link>
    );
};

export default CustomLink;
