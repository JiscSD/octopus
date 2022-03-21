import React from 'react';
import * as SolidIcon from '@heroicons/react/solid';

import * as Stores from '@stores';
import * as Types from '@types';

const Mobile: React.FC = (): React.ReactElement => {
    const toggleCmdPalette = Stores.useGlobalsStore((state: Types.GlobalsStoreType) => state.toggleCmdPalette);

    return (
        <div className="flex items-center justify-center p-1 lg:hidden">
            <button
                onClick={(e) => toggleCmdPalette()}
                aria-label="Search"
                className="rounded border-transparent text-grey-800 outline-0 focus:ring-2 focus:ring-yellow-400"
            >
                <SolidIcon.SearchIcon
                    aria-label="Search Palette"
                    className="h-7 w-7 text-teal-500 transition-colors duration-500"
                />
            </button>
        </div>
    );
};

export default Mobile;
