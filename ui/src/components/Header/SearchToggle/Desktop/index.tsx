import React from 'react';

import * as Stores from '@stores';
import * as Helpers from '@helpers';
import * as Types from '@types';

const Desktop: React.FC = (): JSX.Element => {
    const toggleCmdPalette = Stores.useGlobalsStore((state: Types.GlobalsStoreType) => state.toggleCmdPalette);
    return (
        <button
            className="mr-6 rounded border-transparent p-2 outline-0 focus:ring-2 focus:ring-yellow-400"
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
