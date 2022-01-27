import React from 'react';

import * as Components from '@components';
import * as Assets from '@assets';
import * as Config from '@config';
import * as Stores from '@stores';
import * as Helpers from '@helpers';
import * as Types from '@types';

type Props = {
    fixed?: boolean;
};

const Header: React.FC<Props> = (props): JSX.Element => {
    const toggleCmdPalette = Stores.useGlobalsStore((state: Types.GlobalsStoreType) => state.toggleCmdPalette);

    return (
        <header
            className={`bg-teal-600 py-4 text-white transition-colors duration-500 dark:bg-grey-800 print:hidden ${
                props.fixed && 'lg:fixed lg:top-0 lg:left-0 lg:z-20 lg:w-full'
            }`}
        >
            <div className="container mx-auto flex items-center justify-between px-8">
                <Components.Link
                    href={Config.urls.home.path}
                    className="flex items-center rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                >
                    <Assets.Logo
                        height={50}
                        width={50}
                        className="mr-4 fill-black transition-colors duration-500 dark:fill-teal-600"
                    />
                    <span className="block font-montserrat text-2xl font-bold text-white">Octopus</span>
                </Components.Link>
                <div className="flex items-center">
                    <button className="mr-6" onClick={(e) => toggleCmdPalette()}>
                        Search
                        <span className="ml-2 text-sm text-teal-300 transition-colors duration-500 dark:text-grey-500">
                            {Helpers.setOSKey()}
                        </span>
                    </button>
                    <Components.Nav />
                    <Components.EnableDarkMode />
                </div>
            </div>
        </header>
    );
};

export default Header;
