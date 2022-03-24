import React from 'react';
import * as Framer from 'framer-motion';

type Props = {
    children: React.ReactChild | React.ReactChildren;
};

const Overlay: React.FC<Props> = (props): React.ReactElement => (
    <Framer.AnimatePresence>
        <Framer.motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 z-40 flex h-full w-full justify-center"
        >
            <div className="w-full pt-20 lg:pt-40">{props.children}</div>
            <div className="absolute top-0 left-0 z-40 h-full w-full bg-grey-700 opacity-95" />
        </Framer.motion.div>
    </Framer.AnimatePresence>
);

export default Overlay;
