import React from 'react';
import Link, { LinkProps } from 'next/link';

// custom props will override default attributes if both are provided
type CustomProps = {
    openNew?: boolean;
    ariaLabel?: string;
};

type Props = LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & CustomProps;

type LinkRef = HTMLAnchorElement;

const CustomLink = React.forwardRef<LinkRef, Props>((props, ref) => {
    const { href, children, className, openNew, ariaLabel, ...rest } = props;

    if (openNew) {
        rest.target = '_blank';
        rest.rel = 'noreferrer noopener';
    }

    if (ariaLabel) {
        rest['aria-label'] = ariaLabel;
    }

    return (
        <Link
            ref={ref}
            href={props.href}
            scroll={props.scroll}
            className={`rounded border-transparent decoration-teal-500 underline-offset-2 outline-0 focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 ${
                className ? className : ''
            }`}
            {...rest}
        >
            {children}
        </Link>
    );
});

CustomLink.displayName = 'CustomLink';

export default CustomLink;
