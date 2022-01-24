import { FC } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SunIcon, MoonIcon } from '@heroicons/react/outline';

import { usePreferencesStore } from 'src/lib/stores/preferences';
import { PreferencesStoreTypes } from 'src/lib/types';

const classes = 'w-8 h-8 text-white transition-all';

const EnableDarkMode: FC = (): JSX.Element => {
    const darkMode = usePreferencesStore((state: PreferencesStoreTypes) => state.darkMode);
    const toggle = usePreferencesStore((state: PreferencesStoreTypes) => state.toggle);

    return (
        <button
            type='button'
            aria-pressed={darkMode}
            onClick={(e) => toggle(e)}
            className='rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400'
        >
            <AnimatePresence>
                {darkMode && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        exit={{ opacity: 0 }}
                    >
                        <SunIcon className={classes} />
                    </motion.div>
                )}

                {!darkMode && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        exit={{ opacity: 0 }}
                    >
                        <MoonIcon className={classes} />
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
};

export default EnableDarkMode;
