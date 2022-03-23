import React from 'react';

type Props = {
    id: string;
    title?: string;
    hasBreak?: boolean;
    children: React.ReactChildren | React.ReactChild;
};

const ContentSection: React.FC<Props> = (props): React.ReactElement => {
    return (
        <article id={props.id} className={`mb-10 border-grey-200 pb-6 ${props.hasBreak && 'border-b'}`}>
            {!!props.title && (
                <h2 className="mb-4 block font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-100">
                    {props.title}
                </h2>
            )}
            {props.children}
        </article>
    );
};

export default ContentSection;
