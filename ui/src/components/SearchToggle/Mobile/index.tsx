import React from 'react';
import * as SolidIcon from '@heroicons/react/solid';

const Mobile: React.FC = (): React.ReactElement => {
    return (
        <div className="flex items-center justify-center p-1 lg:hidden">
            <button
                onClick={() => console.log('asd - mobile')}
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
