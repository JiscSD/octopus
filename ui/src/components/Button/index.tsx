import React from 'react';

import * as Components from '@components';

type CommonProps = {
    title: string;
    endIcon?: React.ReactElement;
    startIcon?: React.ReactElement;
    onClick?: (e: React.MouseEvent) => void;
    disabled?: boolean;
    className?: string;
    textSize?: string;
    padding?: string;
};

type ConditionalProps = { href: string; openNew?: boolean } | { href?: never; openNew?: never };

type Props = CommonProps & ConditionalProps;

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
            disabled:opacity-50
            disabled:hover:cursor-not-allowed
            ${props.className ?? ''}
            `;
    }, [props.className]);

    const childStyles = React.useMemo(() => {
        return `
            ${props.startIcon ? 'ml-3' : ''}
            ${props.endIcon ? 'mr-3' : ''}
            ${props.padding ? props.padding : 'py-2'}
            font-montserrat
            text-${props.textSize ? props.textSize : 'sm'}
            font-semibold
            text-grey-800
            dark:text-white-50
            transition-colors
            duration-500
            border-b-2
            border-b-teal-400
            dark:border-b-teal-500
            `;
    }, [props.endIcon, props.padding, props.startIcon, props.textSize]);

    return props.href ? (
        <Components.Link
            href={props.href}
            title={props.title}
            ariaLabel={props.title}
            className={parentStyles}
            openNew={props.openNew}
            onClick={props.onClick}
        >
            <>
                {props.startIcon}
                <span className={childStyles}>{props.children || props.title}</span>
                {props.endIcon}
            </>
        </Components.Link>
    ) : (
        <button
            type="button"
            title={props.title}
            name={props.title}
            aria-label={props.title}
            onClick={props.onClick}
            disabled={props.disabled}
            className={`rounded border-transparent outline-0 focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 ${parentStyles}`}
        >
            {props.startIcon}
            <span className={childStyles}>{props.children || props.title}</span>
            {props.endIcon}
        </button>
    );
};

export default Button;
