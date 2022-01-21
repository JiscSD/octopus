import { FC } from 'react';
import { ArrowCircleUpIcon } from '@heroicons/react/solid';
import { motion } from 'framer-motion';

const ScrollToTop: FC = (): JSX.Element => {
    return (
        <motion.button
            initial={{ scale: 0.5 }}
            animate={{ scale: 1, type: 'spring' }}
            type="button"
            className="fixed z-20 bottom-4 lg:bottom-12 right-4 lg:right-12 rounded-full border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
            onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
        >
            <ArrowCircleUpIcon className="text-grey-800 dark:text-teal-500 transition-colors duration-500  w-16 h-16" />
        </motion.button>
    );
};

export default ScrollToTop;
