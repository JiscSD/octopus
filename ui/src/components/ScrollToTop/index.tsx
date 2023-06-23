import React from 'react';
import * as SolidIcons from '@heroicons/react/24/solid';
import * as Framer from 'framer-motion';
import * as Helpers from '@helpers';

const getButtonVisibility = () =>
    document.documentElement.scrollTop > 0 &&
    document.documentElement.scrollTop /
        (document.documentElement.scrollHeight - document.documentElement.clientHeight) >
        0.8; // show button when page scroll is over 80%

const ScrollToTop: React.FC = (): React.ReactElement => {
    const [visible, setVisible] = React.useState(getButtonVisibility());

    React.useEffect(() => {
        const handleScroll = () => {
            setVisible(getButtonVisibility());
        };

        const debouncedScrollHandler = Helpers.debounce(handleScroll, 100, { maxWait: 300 });

        document.addEventListener('scroll', debouncedScrollHandler);

        return () => {
            document.removeEventListener('scroll', debouncedScrollHandler);
        };
    }, []);

    return (
        <Framer.motion.button
            aria-label="Scroll to Top"
            initial={{ scale: 0, type: 'spring' }}
            whileInView={{ scale: visible ? 1 : 0, type: 'spring' }}
            transition={{ duration: 0.3 }}
            type="button"
            className="fixed bottom-24 right-4 z-20 h-fit rounded-full border-transparent outline-0 focus:ring-2 focus:ring-yellow-400 print:hidden lg:bottom-12 lg:right-12"
            onClick={(e) => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
            <SolidIcons.ArrowUpCircleIcon className="h-14 w-14 text-teal-300" />
        </Framer.motion.button>
    );
};

export default ScrollToTop;
