import React from 'react';

import * as Components from '@/components';

type CommonProps = {
    accordionConfig?: {
        contentElementId: string;
        expanded: Boolean;
    };
    childClassName?: string;
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
    endIcon?: React.ReactElement;
    id?: string;
    onClick?: (e: React.MouseEvent) => void;
    padding?: string;
    startIcon?: React.ReactElement;
    textSize?: string;
    title: string;
    variant?: 'underlined' | 'block' | 'block-alt';
};

type ConditionalProps = { href: string; openNew?: boolean } | { href?: never; openNew?: never };

type Props = CommonProps & ConditionalProps;

const blockClasses =
    'border-2 px-2.5 text-white-50 shadow-sm focus:ring-offset-2 children:border-0 children:text-white-50 ';

const Button: React.FC<Props> = (props): React.ReactElement | null => {
    const parentStyles = React.useMemo(() => {
        let classes =
            'disabled:select-none disabled:opacity-50 disabled:hover:cursor-not-allowed inline-flex items-center w-fit ';
        switch (props.variant) {
            case 'block':
                classes += blockClasses + 'bg-teal-600 ';
                break;
            case 'block-alt':
                classes += blockClasses + 'bg-green-600 ';
                break;
            default:
                classes += 'outline-0 focus:ring-2 focus:ring-yellow-400 ';
        }
        classes += props.className ?? '';
        return classes;
    }, [props.className, props.variant]);

    const childStyles = React.useMemo(() => {
        return (
            // Shared classes
            'font-montserrat font-semibold' +
            // Underline only
            (props.variant !== 'block'
                ? ' border-b-2 border-b-teal-500 dark:border-b-teal-400 text-grey-800 dark:text-white-50 transition-colors duration-500'
                : '') +
            (props.startIcon ? ' ml-3' : '') +
            (props.endIcon ? ' mr-3' : '') +
            (props.padding ? ' ' + props.padding : ' py-2') +
            ` text-${props.textSize ? props.textSize : 'sm'} ${props.childClassName ?? ''}`
        );
    }, [props.endIcon, props.padding, props.startIcon, props.textSize]);

    return props.href ? (
        <Components.Link
            id={props.id}
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
            id={props.id}
            type="button"
            title={props.title}
            name={props.title}
            aria-label={props.title}
            onClick={props.onClick}
            disabled={props.disabled}
            className={`rounded border-transparent outline-0 focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 ${parentStyles}`}
            {...(props.accordionConfig
                ? {
                      'aria-expanded': !!props.accordionConfig.expanded,
                      'aria-controls': props.accordionConfig.contentElementId
                  }
                : {})}
        >
            {props.startIcon}
            <span className={childStyles}>{props.children || props.title}</span>
            {props.endIcon}
        </button>
    );
};

export default Button;
