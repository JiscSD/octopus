import React, { useMemo } from 'react';

import * as Components from '@components';
import * as Interfaces from '@interfaces';
import * as Config from '@config';
import * as Stores from '@stores';
import * as Types from '@types';
import * as Hooks from '@hooks';

const defaultValues = [
    {
        label: 'Browse',
        value: Config.urls.browsePublications.path
    },
    {
        label: 'Publish',
        value: Config.urls.createPublication.path
    }
];

const Nav: React.FC = (): React.ReactElement => {
    const user = Stores.useAuthStore((state: Types.AuthStoreType) => state.user);
    const isMobile = Hooks.useMediaQuery('(max-width: 900px)');

    const items = useMemo(
        () =>
            user
                ? [
                      ...defaultValues,
                      {
                          label: `${user?.firstName} ${user?.lastName}`,
                          value: `${Config.urls.viewUser.path}/${user.id}`,
                          subItems: [
                              {
                                  label: 'My profile',
                                  value: `${Config.urls.viewUser.path}/${user.id}`
                              },
                              {
                                  label: 'My publications',
                                  value: Config.urls.account.path
                              },
                              {
                                  label: 'My bookmarks',
                                  value: Config.urls.myBookmarks.path
                              },
                              <Components.ORCIDLogOutButton key={user.id} />
                          ]
                      }
                  ]
                : defaultValues,
        [user]
    );

    return isMobile ? <Components.NavMobile items={items} /> : <Components.NavDesktop items={items} />;
};

export default Nav;
