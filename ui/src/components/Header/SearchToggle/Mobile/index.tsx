import React from 'react';
import * as SolidIcon from '@heroicons/react/solid';

import * as Stores from '@stores';
import * as Types from '@types';

const Mobile: React.FC = (): JSX.Element => {
    const toggleCmdPalette = Stores.useGlobalsStore((state: Types.GlobalsStoreType) => state.toggleCmdPalette);

    return (
        <div className="ml-4 mr-2 flex items-center justify-center p-1">
            <button
                onClick={(e) => toggleCmdPalette()}
                aria-label="Search"
                className="rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
            >
                <SolidIcon.SearchIcon aria-label="Search Palette" className="h-8 w-8 text-white" />
            </button>
        </div>
    );
};

export default Mobile;
