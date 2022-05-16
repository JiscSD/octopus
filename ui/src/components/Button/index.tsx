import React from 'react';

import * as Components from '@components';

type Props = {
    title: string;
    href?: string;
    link?: boolean;
    icon?: React.ReactElement;
    iconPosition?: 'LEFT' | 'RIGHT';
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
            ${props.iconPosition === 'LEFT' ? 'ml-3' : ''}
            ${props.iconPosition === 'RIGHT' ? 'mr-3' : ''}
            py-2
            font-montserrat
            text-sm
            font-semibold

            text-grey-800
            dark:text-white-50

            transition-colors
            duration-500

            border-b-2
            border-b-teal-400
            dark:border-b-teal-500
            `;
    }, [props.iconPosition]);

    if (props.link && props.href) {
        return (
            <Components.Link href={props.href} title={props.title} ariaLabel={props.title} className={parentStyles}>
                <>
                    {props.iconPosition === 'LEFT' && props.icon}
                    <span className={childStyles}>{props.title}</span>
                    {props.iconPosition === 'RIGHT' && props.icon}
                </>
            </Components.Link>
        );
    }

    if (props.onClick) {
        return (
            <button
                type="button"
                title={props.title}
                name={props.title}
                aria-label={props.title}
                onClick={props.onClick}
                disabled={props.disabled}
                className={`rounded border-transparent outline-0 focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 ${parentStyles}`}
            >
                {props.iconPosition === 'LEFT' && props.icon}
                <span className={childStyles}>{props.title}</span>
                {props.iconPosition === 'RIGHT' && props.icon}
            </button>
        );
    }

    return null;
};

export default Button;
