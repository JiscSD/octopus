import React from 'react';

import * as Components from '@components';
import * as Stores from '@stores';
import * as Config from '@config';
import * as Types from '@types';
import * as Assets from '@assets';

type Props = {
    fixed?: boolean;
};

const Header: React.FC<Props> = (props): React.ReactElement => {
    const user = Stores.useAuthStore((state: Types.AuthStoreType) => state.user);

    return (
        <>
            <header
                className={`text-grey-800 transition-colors duration-500  print:hidden  ${
                    props.fixed && 'lg:fixed lg:top-0 lg:left-0 lg:z-20 lg:w-full'
                }`}
            >
                <div className="container mx-auto px-8">
                    <div className={`flex items-center justify-between border-b border-grey-200 py-6`}>
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
                            {!user && <Components.ORCIDLogInButton />}
                            <Components.EnableDarkMode />
                        </div>

                        {/* <svg
                            width="1652"
                            height="24"
                            viewBox="0 0 1652 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute -bottom-5 w-full"
                        >
                            <path
                                d="M1 11.9913C54.6656 13.4214 146.912 21.1436 258.595 18.8556C370.277 16.5675 421.042 1.43753 537.076 1.00851C653.11 0.579496 699.523 16.5103 815.557 16.7963C931.591 17.0823 978.004 1.09431 1094.04 2.38136C1210.07 3.66841 1256.49 22.2591 1372.52 22.9741C1488.55 23.6891 1592.98 9.38861 1651 5.81348"
                                stroke="url(#paint0_linear_4_100)"
                                strokeWidth="1"
                                strokeLinecap="round"
                            />
                            <defs>
                                <linearGradient
                                    id="paint0_linear_4_100"
                                    x1="-32.4436"
                                    y1="-272.875"
                                    x2="34.4965"
                                    y2="-272.875"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stopColor="#B3BCCB" />
                                    <stop offset="1" stopColor="#B3BCCB" />
                                </linearGradient>
                            </defs>
                        </svg> */}
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
