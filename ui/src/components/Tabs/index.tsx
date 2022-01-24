import React from 'react';

import * as Components from '@components';

interface TabEntry {
    title: string;
    content: React.ReactNode;
}

type Props = {
    content: TabEntry[];
};

const Tabs: React.FC<Props> = (props): JSX.Element => {
    const [active, setActive] = React.useState<React.ReactNode>(props.content[0]);

    return (
        <div className="tabs">
            <div className="flex mb-12">
                {props.content.map((entry) => {
                    return <Components.TabHead key={entry.title} tab={entry} active={active} set={setActive} />;
                })}
            </div>

            {props.content.map((entry) => {
                return entry === active && <Components.Tab key={entry.title}>{entry.content}</Components.Tab>;
            })}
        </div>
    );
};

export default Tabs;
