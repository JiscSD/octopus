import React from 'react';
import { AnimatePresence } from 'framer-motion';

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
            <div className="tab-head flex">
                {props.content.map((entry) => {
                    return <Components.TabHead key={entry.title} heading={entry.title} tab={entry} set={setActive} />;
                })}
            </div>

            <AnimatePresence>
                {props.content.map((entry) => {
                    return entry === active ? <Components.Tab key={entry.title}>{entry.content}</Components.Tab> : null;
                })}
            </AnimatePresence>
        </div>
    );
};

export default Tabs;
