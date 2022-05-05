import React from 'react';

import * as Assets from '@assets';

type Props = {
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    loading?: boolean;
    ref?: React.RefObject<HTMLButtonElement>;
    className?: string;
    actionType: 'POSITIVE' | 'NEGATIVE';
    text: string;
    title: string;
};

const Button: React.FC<Props> = (props) => (
    <button
        type="button"
        aria-label={props.title}
        title={props.title}
        className={`
            mt-3
            inline-flex
            w-full
            justify-center
            rounded-md
            border
            px-4
            py-2
            text-base 
            font-medium
            text-white-50
            shadow-sm
            focus:outline-none
            focus:ring-2
            focus:ring-yellow-500
            focus:ring-offset-2
            disabled:opacity-50
            sm:col-start-1
            sm:mt-0
            sm:text-sm
            ${props.actionType === 'POSITIVE' && 'bg-teal-600 hover:bg-teal-700 disabled:hover:bg-teal-600'}
            ${props.actionType === 'NEGATIVE' && 'bg-red-600 hover:bg-red-700 disabled:hover:bg-red-600 '}
            `}
        onClick={(e) => props.onClick(e)}
        disabled={props.disabled}
        {...(props.ref && { ref: props.ref })}
    >
        {props.loading ? <Assets.Spinner width={25} height={25} className="stroke-white-50" /> : props.text}
    </button>
);

export default Button;
