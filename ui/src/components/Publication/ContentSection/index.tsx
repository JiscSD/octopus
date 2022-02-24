import React from 'react';

type Props = {
    id: string;
    title: string;
    children: React.ReactChildren | React.ReactChild;
};

const ContentSection: React.FC<Props> = (props): JSX.Element => {
    return (
        <article id={props.id} className="pt-12">
            <h2 className="mb-4 block font-montserrat text-2xl font-semibold text-grey-800 transition-colors duration-500 dark:text-teal-500">
                {props.title}
            </h2>
            {props.children}
        </article>
    );
};

export default ContentSection;
