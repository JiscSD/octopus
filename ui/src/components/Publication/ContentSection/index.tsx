import React from 'react';

type Props = {
    id: string;
    title?: string;
    hasBreak?: boolean;
    isMainText?: boolean;
    children: React.ReactNode;
};

const ContentSection: React.FC<Props> = (props): React.ReactElement => (
    <article
        id={props.id}
        className={`border-grey-200 py-10 ${props.isMainText && 'lg:pt-0'} ${props.hasBreak && 'border-b'}`}
    >
        {!!props.title && (
            <h2 className="mb-4 block font-montserrat text-xl font-semibold text-grey-800 transition-colors duration-500 dark:text-white-100">
                {props.title}
            </h2>
        )}
        {props.children}
    </article>
);

export default ContentSection;
