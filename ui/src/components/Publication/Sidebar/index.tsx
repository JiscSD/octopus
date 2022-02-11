import React from 'react';

interface JumpTo {
    title: string;
    href: string;
}

type Props = {
    jumpToList: JumpTo[];
};

const Sidebar: React.FC<Props> = (props): JSX.Element => (
    <div className="sticky top-16">
        <span className="mb-6 block border-b border-grey-200 pb-6 font-montserrat font-semibold text-grey-700 transition-colors duration-500 dark:text-grey-50">
            Jump to:
        </span>
        {props.jumpToList.map((jumpTo: JumpTo) => (
            <a
                key={jumpTo.href}
                href={`#${jumpTo.href}`}
                className="mb-1 block w-fit rounded border-transparent py-1 text-grey-800 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-grey-100"
            >
                {jumpTo.title}
            </a>
        ))}
    </div>
);

export default Sidebar;
