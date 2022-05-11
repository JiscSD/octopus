import React from 'react';

type Props = {
    value: string;
    placeholder?: string;
    onChange: (value: string) => void;
};

const NewComment: React.FC<Props> = (props): React.ReactElement => (
    <textarea
        name="red-flag-comment"
        id="red-flag-comment"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        required
        rows={5}
        placeholder={props.placeholder ?? 'Leave your comment here'}
        className="block w-full rounded-md border border-grey-100 bg-white-50 text-grey-800 shadow outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400"
    />
);

export default NewComment;
