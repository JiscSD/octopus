import React from 'react';

type Props = {
    text: string;
    className?: string;
};

const PageSubTitle: React.FC<Props> = (props): React.ReactElement => (
    <h2
        className={`mx-auto mb-8 block font-montserrat text-3xl font-bold text-grey-900 transition-colors duration-500 dark:text-grey-100 ${
            props.className ?? ''
        }`}
    >
        {props.text}
    </h2>
);

export default PageSubTitle;
