import React, { useMemo } from 'react';

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

    const handleLogOut = async () => {
        await router.push({
            pathname: `${Config.urls.home.path}`
        });
        Helpers.clearJWT();
        setUser(null);
    };

    const items = useMemo(() => {
        const menuItems: Interfaces.NavMenuItem[] = [
            {
                label: 'Browse',
                value: Config.urls.browsePublications.path
            },
            {
                label: 'How To',
                value: '',
                subItems: [
                    {
                        label: 'FAQ',
                        value: Config.urls.faq.path
                    },
                    {
                        label: 'Author Guide',
                        value: Config.urls.authorGuide.path
                    },
                    {
                        label: 'Our Aims',
                        value: Config.urls.octopusAims.path
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
                        label: 'My bookmarks',
                        value: Config.urls.myBookmarks.path
                    },
                    {
                        label: 'Log out',
                        value: '#',
                        onClick: () => handleLogOut()
                    }
                ]
            });
        }

        return menuItems;
    }, [user]);

    return isDesktop ? <Components.NavDesktop items={items} /> : <Components.NavMobile items={items} />;
};

export default Nav;
