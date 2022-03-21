import React from 'react';
import * as SolidIcons from '@heroicons/react/solid';
import * as Framer from 'framer-motion';

const ScrollToTop: React.FC = (): React.ReactElement => {
    return (
        <Framer.motion.button
            aria-label="Scroll to Top"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1, type: 'spring' }}
            type="button"
            className="absolute bottom-24 right-4 z-20 h-fit rounded-full border-transparent outline-0 focus:ring-2 focus:ring-yellow-400 print:hidden lg:bottom-12 lg:right-12"
            onClick={(e) => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
            <SolidIcons.ArrowCircleUpIcon className="h-14 w-14 text-teal-300" />
        </Framer.motion.button>
    );
};

export default ScrollToTop;
