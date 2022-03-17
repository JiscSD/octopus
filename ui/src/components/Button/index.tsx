import React from 'react';

import * as Components from '@components';

type Props = {
    title: string;
    href?: string;
    link?: boolean;
    icon?: React.ReactElement;
    onClick?: (e: React.MouseEvent) => void;
    disabled?: boolean;
    className?: string;
};

const Button: React.FC<Props> = (props): React.ReactElement | null => {
    const parentStyles = React.useMemo(() => {
        return `
            p-2
            group
            inline-flex
            items-center
            outline-0
            focus:ring-2
            focus:ring-yellow-400
            disabled:select-none
            disabled:opacity-50
            disabled:hover:cursor-not-allowed
            ${props.className ?? ''}
            `;
    }, [props.className]);

    const childStyles = React.useMemo(() => {
        return `
            ${props.icon ? 'mr-2 pr-2' : ''}
            py-2
            font-montserrat
            text-sm
            font-semibold

            text-grey-800
            dark:text-white

            transition-colors
            duration-500

            border-b-2
            border-b-teal-400
            dark:border-b-teal-500
            `;
    }, [props.icon]);

    if (props.link && props.href) {
        return (
            <Components.Link href={props.href} title={props.title} className={parentStyles}>
                <>
                    <span className={childStyles}>{props.title}</span>
                    {props.icon}
                </>
            </Components.Link>
        );
    }

    if (props.onClick) {
        return (
            <button
                type="button"
                title={props.title}
                onClick={props.onClick}
                disabled={props.disabled}
                className={`rounded border-transparent outline-0 focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 ${parentStyles}`}
            >
                <span className={childStyles}>{props.title}</span>
                {props.icon}
            </button>
        );
    }

    return null;
};

export default Button;
