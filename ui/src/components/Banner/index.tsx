import React from 'react';

type Props = {
    text: string;
};

const Banner: React.FC<Props> = (props): React.ReactElement => (
    <span className="block w-full items-center bg-teal-300 p-2 text-center text-sm text-black transition-colors duration-500 dark:bg-teal-700 dark:text-grey-100">
        {props.text}
    </span>
);

export default Banner;
