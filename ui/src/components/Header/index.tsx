import { FC } from 'react';

import * as Components from '@components';
import * as Assets from '@assets';
import * as Config from '@config';

const Header: FC = (): JSX.Element => {
    return (
        <header className="bg-purple-300 dark:bg-grey-800 py-4 text-white transition-all duration-500">
            <div className="flex items-center justify-between container mx-auto px-8">
                <Components.Link
                    href={Config.urls.home.path}
                    className="flex items-center rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                >
                    <Assets.Logo
                        height={50}
                        width={50}
                        className="mr-4 fill-black dark:fill-purple-300 transition-all duration-500"
                    />
                    <span className="block font-montserrat text-2xl font-bold text-white">Octopus</span>
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
