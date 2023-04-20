import React from 'react';
import Link, { LinkProps } from 'next/link';

// custom props will override default attributes if both are provided
type CustomProps = {
    openNew?: boolean;
    ariaLabel?: string;
};

const CustomLink: React.FC<LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & CustomProps> = (
    props
): React.ReactElement => {
    const { href, children, className, openNew, ariaLabel, ...rest } = props;

    if (openNew) {
        rest.target = '_blank';
        rest.rel = 'noreferrer noopener';
    }

    if (ariaLabel) {
        rest['aria-label'] = ariaLabel;
    }

    return (
        <Link href={props.href} scroll={props.scroll}>
            <a
                className={`rounded border-transparent decoration-teal-500 underline-offset-2 outline-0 focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 ${
                    className ? className : ''
                }`}
                {...rest}
            >
                {children}
            </a>
        </Link>
    );
};

export default CustomLink;
