import React from 'react';

interface Action {
    title: string;
    href: string;
}

type Props = {
    actions: Action[];
};

const Sidebar: React.FC<Props> = (props): JSX.Element => {
    return (
        <div className="sticky top-28">
            <span className="mb-6 block border-b border-grey-200 pb-6 font-montserrat font-semibold text-grey-700 transition-colors duration-500 dark:text-grey-50">
                Jump to:
            </span>
            {props.actions.map((action: Action) => (
                <a
                    key={action.href}
                    href={`#${action.href}`}
                    className="mb-1 block w-fit rounded border-transparent py-1 text-grey-800 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-grey-100"
                >
                    {action.title}
                </a>
            ))}
        </div>
    );
};

export default Sidebar;
