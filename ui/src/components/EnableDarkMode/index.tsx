import React from 'react';
import * as OutlineIcons from '@heroicons/react/outline';
import * as HeadlessUI from '@headlessui/react';

import * as Stores from '@stores';
import * as Types from '@types';

const EnableDarkMode: React.FC = (): React.ReactElement => {
    const darkMode = Stores.usePreferencesStore((state: Types.PreferencesStoreTypes) => state.darkMode);
    const toggleDarkMode = Stores.usePreferencesStore((state: Types.PreferencesStoreTypes) => state.toggleDarkMode);

    return (
        <HeadlessUI.Switch
            checked={darkMode}
            onChange={toggleDarkMode}
            className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer items-center rounded-full border-2 border-teal-500 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                darkMode ? 'bg-grey-800' : 'bg-white-50'
            }`}
        >
            <span className="sr-only">Use setting</span>
            <span
                className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out ${
                    !darkMode ? 'translate-x-5' : 'translate-x-1'
                }`}
            >
                <span
                    className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                        !darkMode ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in'
                    }`}
                    aria-hidden="true"
                >
                    <OutlineIcons.SunIcon className="h-7 w-7 text-white-50 transition-all" />
                </span>
                <span
                    className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                        !darkMode ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out'
                    }`}
                    aria-hidden="true"
                >
                    <OutlineIcons.MoonIcon className="h-7 w-7 text-teal-500 transition-all" />
                </span>
            </span>
        </HeadlessUI.Switch>
    );
};

export default EnableDarkMode;
