import React from 'react';

type Props = {
    text: string;
    className?: string;
};

const PageTitle: React.FC<Props> = (props): React.ReactElement => (
    <h1
        className={`block font-montserrat text-2xl font-bold leading-tight text-grey-800 transition-colors duration-500 dark:text-white-50 md:text-3xl lg:mb-8 xl:text-4xl xl:leading-normal ${
            props.className ? props.className : ''
        }`}
    >
        {props.text}
    </h1>
);

export default PageTitle;
