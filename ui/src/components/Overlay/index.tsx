import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
    children: React.ReactChild | React.ReactChildren;
};

const Overlay: React.FC<Props> = (props): JSX.Element => (
    <AnimatePresence>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 z-30 flex h-full w-full justify-center"
        >
            <div className="pt-20 lg:pt-60">{props.children}</div>
            <div className="absolute top-0 left-0 z-40 h-full w-full bg-grey-800 opacity-90" />
        </motion.div>
    </AnimatePresence>
);

export default Overlay;
