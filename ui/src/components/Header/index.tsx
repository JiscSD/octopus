import React from 'react';

import * as Components from '@components';
import * as Assets from '@assets';
import * as Config from '@config';

type Props = {
    fixed?: boolean;
};

const Header: React.FC<Props> = (props): JSX.Element => {
    return (
        <header
            className={`bg-teal-600 py-4 text-white shadow-sm shadow-white transition-colors duration-500 dark:bg-grey-800 dark:shadow-none ${
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
                    <span className="font-manrope block text-2xl font-bold text-white">Octopus</span>
                </Components.Link>
                <div className="flex items-center">
                    <Components.Nav />
                    <Components.EnableDarkMode />
                </div>
            </div>
        </header>
    );
};

export default Header;
