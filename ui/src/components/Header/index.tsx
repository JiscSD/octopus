import React from 'react';
import * as NextRouter from 'next/router';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Components from '@components';
import * as Assets from '@assets';
import * as Config from '@config';
import * as Stores from '@stores';
import * as Types from '@types';

type Props = {
    fixed?: boolean;
    hasBorder?: boolean;
};

const Header: React.FC<Props> = (props): React.ReactElement => {
    const user = Stores.useAuthStore((state) => state.user);
    const router = NextRouter.useRouter();

    return (
        <>
            <Components.Banner
                text="This is test release - we're still working on the site. Please don't use it for recording your real
        work... yet!"
            />
            {/* Confirm email banner */}
            {user && !user?.email && router.pathname !== Config.urls.verify.path && (
                <div className="bg-yellow-200 text-sm text-grey-800 dark:bg-yellow-500">
                    <div className="container mx-auto flex items-center gap-2 px-8 py-3">
                        <OutlineIcons.ExclamationCircleIcon className="h-5 w-5 text-grey-800" />
                        <Components.Link
                            href={`${Config.urls.verify.path}?newUser=true`}
                            className="w-fit underline decoration-2 underline-offset-4"
                        >
                            Please confirm your email address to publish content
                        </Components.Link>
                    </div>
                </div>
            )}

            <header
                className={`text-grey-800 transition-colors duration-500  print:hidden  ${
                    props.fixed && 'lg:fixed lg:top-0 lg:left-0 lg:z-20 lg:w-full'
                }`}
            >
                <div className="container mx-auto px-8">
                    <div
                        className={`flex items-center justify-between py-6 transition-colors duration-500 ${
                            props.hasBorder ? 'border-b border-grey-200 dark:border-grey-400' : ''
                        }`}
                    >
                        <Components.Link href={Config.urls.home.path} className="flex items-center border-transparent">
                            <Assets.Logo
                                height={30}
                                width={30}
                                className="fill-grey-800 transition-colors duration-500 dark:fill-teal-500"
                            />
                            <span className="ml-2 block font-montserrat text-2xl font-bold text-grey-800 transition-colors duration-500 dark:text-white-50">
                                Octopus
                            </span>
                        </Components.Link>
                        <div className="flex items-center space-x-3 lg:space-x-4">
                            <Components.Search />
                            <Components.Nav />
                            {!user && <Components.ORCIDLogInButton currentPath={router.asPath} />}
                            <Components.EnableDarkMode />
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
