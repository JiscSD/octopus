import React from 'react';

import * as Stores from '@stores';
import * as Helpers from '@helpers';
import * as Types from '@types';

const Desktop: React.FC = (): React.ReactElement => {
    const toggleCmdPalette = Stores.useGlobalsStore((state: Types.GlobalsStoreType) => state.toggleCmdPalette);
    return (
        <button
            className="hidden rounded border-transparent p-2 font-medium text-grey-800 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-white-50 lg:block"
            onClick={(e) => toggleCmdPalette()}
        >
            Search
            <span className="ml-2 text-sm text-teal-300 transition-colors duration-500 dark:text-grey-500">
                {Helpers.setOSKey()}
            </span>
        </button>
    );
};

export default Desktop;
