import React from 'react';

import * as Components from '@components';
import * as Stores from '@stores';
import * as Config from '@config';
import * as Types from '@types';

type Props = {
    fixed?: boolean;
};

const Header: React.FC<Props> = (props): JSX.Element => {
    const user = Stores.useAuthStore((state: Types.AuthStoreType) => state.user);

    return (
        <>
            <header
                className={`bg-teal-500 py-6 text-white transition-colors duration-500 dark:bg-grey-800 print:hidden ${
                    props.fixed && 'lg:fixed lg:top-0 lg:left-0 lg:z-20 lg:w-full'
                }`}
            >
                <div className="container mx-auto flex items-center justify-between px-8">
                    <Components.Link
                        href={Config.urls.home.path}
                        className="flex items-center rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                    >
                        <span className="block font-montserrat text-2xl font-bold text-white">Octopus</span>
                    </Components.Link>
                    <div className="flex items-center space-x-3 lg:space-x-4">
                        <Components.Search />
                        <Components.Nav />
                        {!user && <Components.ORCIDLogInButton />}
                        <Components.EnableDarkMode />
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
