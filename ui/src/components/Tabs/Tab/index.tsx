import React from 'react';
import * as Framer from 'framer-motion';

type Props = {
    children: React.ReactElement | React.ReactText | React.ReactNode;
};

const Tab: React.FC<Props> = (props): React.ReactElement => {
    return (
        <Framer.motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
            {props.children}
        </Framer.motion.div>
    );
};

export default Tab;
