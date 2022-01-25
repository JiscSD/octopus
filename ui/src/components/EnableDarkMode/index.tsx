import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SunIcon, MoonIcon } from '@heroicons/react/outline';

import * as Types from '@types';
import * as Stores from '@stores';

const EnableDarkMode: React.FC = (): JSX.Element => {
    const darkMode = Stores.usePreferencesStore((state: Types.PreferencesStoreTypes) => state.darkMode);
    const toggle = Stores.usePreferencesStore((state: Types.PreferencesStoreTypes) => state.toggle);

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
                        <SunIcon className='w-8 h-8 text-white transition-all' />
                    </motion.div>
                )}

                {!darkMode && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        exit={{ opacity: 0 }}
                    >
                        <MoonIcon className='w-8 h-8 text-white transition-all' />
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
};

export default EnableDarkMode;
