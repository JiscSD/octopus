import React from 'react';

import * as NextRouter from 'next/router';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as Components from '@/components';
import * as Assets from '@/assets';
import * as Config from '@/config';
import * as Stores from '@/stores';

type Props = {
    fixed?: boolean;
    hasBorder?: boolean;
};

const Header: React.FC<Props> = (props): React.ReactElement => {
    const user = Stores.useAuthStore((state) => state.user);
    const isDarkMode = Stores.usePreferencesStore((state) => state.darkMode);
    const router = NextRouter.useRouter();

    const showConfirmEmailBanner = user && !user?.email && router.pathname !== Config.urls.verify.path;
    const showMissingNamesBanner =
        user && !user?.firstName && !user?.lastName && router.pathname !== Config.urls.verify.path;

    return (
        <>
            <Components.Banner>
                Help us improve by providing{' '}
                <Components.Link
                    href="https://forms.office.com/e/80g02emciH"
                    className="w-fit underline  underline-offset-4"
                    openNew
                >
                    feedback
                </Components.Link>{' '}
                or contacting{' '}
                <Components.Link href="mailto:help@jisc.ac.uk" openNew className="w-fit underline  underline-offset-4">
                    help@jisc.ac.uk
                </Components.Link>
            </Components.Banner>
            {/* Confirm email banner */}
            {(showConfirmEmailBanner || showMissingNamesBanner) && (
                <div className="bg-yellow-200 text-sm text-grey-800 dark:bg-yellow-500">
                    <div className="container mx-auto flex items-center gap-2 px-8 py-3">
                        <OutlineIcons.ExclamationCircleIcon className="h-5 w-5 text-grey-800" />
                        <Components.Link
                            href={showConfirmEmailBanner ? Config.urls.verify.path : Config.urls.orcidAccountPage.path}
                            className="w-fit underline underline-offset-4"
                            openNew={true}
                        >
                            {showConfirmEmailBanner
                                ? 'Please confirm your email address to be able to publish content.'
                                : 'Your name is not visible on your ORCiD account. Please change this setting to "Everyone" or "Trusted parties" to be able to publish content.'}
                        </Components.Link>
                    </div>
                </div>
            )}

            <header
                className={`text-grey-800 transition-colors duration-500  print:hidden  ${
                    props.fixed && 'lg:fixed lg:left-0 lg:top-0 lg:z-20 lg:w-full'
                }`}
            >
                <div className="container mx-auto px-8">
                    <div
                        className={`flex items-center justify-between py-6 transition-colors duration-500 ${
                            props.hasBorder ? 'border-b border-grey-200 dark:border-grey-400' : ''
                        }`}
                    >
                        <Components.Link
                            href={Config.urls.home.path}
                            className="flex max-h-[42px] items-center border-transparent"
                        >
                            {isDarkMode ? (
                                <Assets.LogoDark height={150} width={150} />
                            ) : (
                                <Assets.LogoLight height={150} width={150} />
                            )}
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

export default React.memo(Header);
