import React from 'react';

interface TabEntry {
    title: string;
    content: React.ReactNode;
}

type Props = {
    tab: TabEntry;
    active: React.ReactNode;
    set: React.Dispatch<React.SetStateAction<React.ReactNode>>;
};

const TabHead: React.FC<Props> = (props): JSX.Element => (
    <button
        className={`mr-4 border-b-4 border-transparent px-4 pt-3 pb-2 font-montserrat text-lg font-medium leading-tight transition-colors duration-500 ${
            props.tab === props.active ? 'border-teal-500 bg-teal-100' : 'bg-grey-100 dark:bg-grey-600 dark:text-white'
        }`}
        onClick={() => props.set(props.tab)}
    >
        {props.tab.title}
    </button>
);

export default TabHead;
