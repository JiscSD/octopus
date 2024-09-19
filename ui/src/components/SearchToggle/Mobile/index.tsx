import React from 'react';
import * as SolidIcon from '@heroicons/react/24/solid';
import * as Router from 'next/router';
import * as Config from '@/config';

const Mobile: React.FC = (): React.ReactElement => {
    const router = Router.useRouter();
    return (
        <div className="flex items-center justify-center p-1 lg:hidden">
            <button
                onClick={(e) => router.push(`${Config.urls.search.path}/publications`)}
                aria-label="Search"
                className="rounded border-transparent text-grey-800 outline-0 focus:ring-2 focus:ring-yellow-400"
            >
                <SolidIcon.MagnifyingGlassIcon
                    aria-label="Search Palette"
                    className="h-7 w-7 text-teal-500 transition-colors duration-500"
                />
            </button>
        </div>
    );
};

export default Mobile;
