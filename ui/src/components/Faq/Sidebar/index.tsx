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
    <div className="sticky top-16">
        {props.jumpToList.map((jumpTo: JumpTo) => (
            <a
                key={jumpTo.href}
                href={`#${jumpTo.href}`}
                className="mb-0.5 block w-fit rounded border-transparent py-0.5 text-sm text-grey-800 outline-0 transition-colors duration-500 hover:underline focus:ring-2 focus:ring-yellow-400 dark:text-grey-100"
            >
                <ul>
                    <li>{jumpTo.title}</li>
                </ul>
            </a>
        ))}
    </div>
);

export default FaqSidebar;
