import React, { useCallback, useMemo } from 'react';

import * as Components from '@components';
import * as Router from 'next/router';
import * as Interfaces from '@interfaces';
import * as Config from '@config';
import * as Stores from '@stores';
import * as Hooks from '@hooks';
import * as Helpers from '@helpers';

const Nav: React.FC = (): React.ReactElement => {
    const { user, setUser } = Stores.useAuthStore();
    const isDesktop = Hooks.useMediaQuery('(min-width: 1024px)');

    const router = Router.useRouter();

    const handleLogOut = useCallback(async () => {
        await router.push({
            pathname: `${Config.urls.home.path}`
        });
        Helpers.clearJWT();
        setUser(null);
    }, [router, setUser]);

    const items = useMemo(() => {
        const menuItems: Interfaces.NavMenuItem[] = [
            {
                label: 'Browse',
                value: Config.urls.browsePublications.path
            },
            {
                label: 'About',
                value: '#about',
                subItems: [
                    {
                        label: 'Learn More',
                        value: Config.urls.about.path
                    },
                    // {
                    //     label: 'Report',
                    //     value: Config.urls.researchCultureReport.path
                    // },
                    {
                        label: 'News and Updates',
                        value: Config.urls.blog.path
                    },
                    {
                        label: 'Our Aims',
                        value: Config.urls.octopusAims.path
                    }
                ]
            },
            {
                label: 'How To',
                value: '#how-to',
                subItems: [
                    {
                        label: 'Author Guide',
                        value: Config.urls.authorGuide.path
                    },
                    {
                        label: 'FAQ',
                        value: Config.urls.faq.path
                    }
                ]
            },
            {
                label: 'Publish',
                value: Config.urls.createPublication.path
            }
        ];

        if (user) {
            menuItems.push({
                label: `${user?.firstName} ${user?.lastName}`,
                value: `${Config.urls.viewUser.path}/${user.id}`,
                dataTestId: 'username-button',
                subItems: [
                    {
                        label: 'My Account',
                        value: Config.urls.account.path
                    },
                    {
                        label: 'My Bookmarks',
                        value: Config.urls.myBookmarks.path
                    },
                    {
                        label: 'Log out',
                        value: '#log-out',
                        onClick: () => handleLogOut()
                    }
                ]
            });
        }

        return menuItems;
    }, [handleLogOut, user]);

    return isDesktop ? <Components.NavDesktop items={items} /> : <Components.NavMobile items={items} />;
};

export default Nav;
