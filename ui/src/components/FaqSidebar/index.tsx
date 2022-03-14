import React from 'react';

interface JumpTo {
    title: string;
    href: string;
}

type Props = {
    jumpToList: JumpTo[];
    linkClassNames?: string;
};

const FaqSidebar: React.FC<Props> = (props): JSX.Element => (
    <div className="sticky top-16 pt-24">
        {props.jumpToList.map((jumpTo: JumpTo) => (
            <a
                key={jumpTo.href}
                href={`#${jumpTo.href}`}
                className="text-gray-900 mb-1 block w-fit rounded border-transparent py-1 text-base font-medium text-grey-800 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-grey-100 md:col-span-5"
            >
                {jumpTo.title}
            </a>
        ))}
    </div>
);

export default FaqSidebar;
