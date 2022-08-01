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
    textSize?: string;
    padding?: string;
};

const Button: React.FC<Props> = (props): React.ReactElement | null => {
    const parentStyles = React.useMemo(() => {
        return `
            group
            inline-flex
            items-center
            outline-0
            focus:ring-2
            focus:ring-yellow-400
            disabled:select-none
            disabled:opacity-30
            disabled:hover:cursor-not-allowed
            ${props.className ?? ''}
            bg-teal-700 
            text-white-50
            shadow-xl
            p-2
            rounded-xl
            `;
    }, [props.className]);

    const childStyles = React.useMemo(() => {
        return `
            ${props.iconPosition === 'LEFT' ? 'ml-3 px-1' : ''}
            ${props.iconPosition === 'RIGHT' ? 'mr-3 px-1' : ''}
            ${props.padding ? props.padding : 'py-2'}
            font-montserrat
            text-${props.textSize ? props.textSize : 'sm'}
            font-semibold


            transition-colors
            duration-500
            px-1

            `;
    }, [props.iconPosition]);

    if (props.link && props.href) {
        return (
            <Components.Link
                href={props.href}
                title={props.title}
                ariaLabel={props.title}
                className={parentStyles}
                openNew
            >
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
