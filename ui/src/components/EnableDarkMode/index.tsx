import React from 'react';
import * as Framer from 'framer-motion';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Stores from '@stores';
import * as Types from '@types';

const EnableDarkMode: React.FC = (): JSX.Element => {
    const darkMode = Stores.usePreferencesStore((state: Types.PreferencesStoreTypes) => state.darkMode);
    const toggle = Stores.usePreferencesStore((state: Types.PreferencesStoreTypes) => state.toggle);

    return (
        <button
            type="button"
            aria-label="Enable Dark Mode"
            aria-pressed={darkMode}
            onClick={(e) => toggle(e)}
            className="rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
        >
            <Framer.AnimatePresence>
                {darkMode && (
                    <Framer.motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        exit={{ opacity: 0 }}
                    >
                        <OutlineIcons.SunIcon className="h-8 w-8 text-white transition-all" />
                    </Framer.motion.div>
                )}

                {!darkMode && (
                    <Framer.motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        exit={{ opacity: 0 }}
                    >
                        <OutlineIcons.MoonIcon className="h-8 w-8 text-white transition-all" />
                    </Framer.motion.div>
                )}
            </Framer.AnimatePresence>
        </button>
    );
};

export default EnableDarkMode;
