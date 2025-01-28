import React from 'react';

type Props = {
    checked?: boolean;
    className?: string;
    disabled?: boolean;
    id: string;
    inputClassName?: string;
    label: string;
    name: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
};

const Checkbox: React.FC<Props> = (props) => {
    return (
        <label
            htmlFor={props.id}
            className={`flex cursor-pointer items-center gap-4 text-sm${props.className ? ` ${props.className}` : ''}`}
        >
            <input
                required={props.required}
                disabled={props.disabled}
                id={props.id}
                name={props.name}
                type="checkbox"
                checked={props.checked}
                onChange={props.onChange}
                className={`cursor-pointer rounded-sm bg-white-50 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed${props.inputClassName ? ` ${props.inputClassName}` : ''}`}
            />
            <span
                className={`${props.disabled ? 'text-grey-500 dark:text-grey-200' : 'text-grey-800 dark:text-white-50'} transition-colors`}
            >
                {props.label}
            </span>
        </label>
    );
};

export default Checkbox;
