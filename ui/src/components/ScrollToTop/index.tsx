import React from 'react';
import { ArrowCircleUpIcon } from '@heroicons/react/solid';
import { motion } from 'framer-motion';

const ScrollToTop: React.FC = (): JSX.Element => {
    return (
        <motion.button
            initial={{ scale: 0.5 }}
            animate={{ scale: 1, type: 'spring' }}
            type="button"
            className="fixed bottom-4 right-4 z-20 rounded-full border-transparent outline-0 focus:ring-2 focus:ring-yellow-400 lg:bottom-12 lg:right-12"
            onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
        >
            <ArrowCircleUpIcon className="h-16 w-16 text-grey-800 transition-colors  duration-500 dark:text-teal-500" />
        </motion.button>
    );
};

export default ScrollToTop;
