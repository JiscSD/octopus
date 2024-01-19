import React from 'react';

interface JumpTo {
    title: string;
    href: string;
}

type Props = {
    jumpToList: JumpTo[];
    linkClassNames?: string;
};

const PageContentsSidebar: React.FC<Props> = (props): JSX.Element => (
    <ul className="sticky top-16 border-l border-l-teal-200 pl-4">
        {props.jumpToList.map((jumpTo: JumpTo) => (
            <li
                key={jumpTo.href}
                className="border-transparen mb-2 block w-fit py-0.5 text-sm text-grey-800 outline-0 transition-colors duration-500 hover:text-teal-400 hover:underline focus:ring-2 focus:ring-yellow-400 dark:text-grey-100"
            >
                <a key={jumpTo.href} href={`#${jumpTo.href}`}>
                    {jumpTo.title}
                </a>
            </li>
        ))}
    </ul>
);

export default PageContentsSidebar;
