import React from 'react';

type Props = {
    heading: string;
    tab: React.ReactNode;
    set: React.Dispatch<React.SetStateAction<React.ReactNode>>;
};

const TabHead: React.FC<Props> = (props): JSX.Element => {
    return (
        <button onClick={() => props.set(props.tab)}>{props.heading}</button>
    );
};

export default TabHead;
