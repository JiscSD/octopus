import React from 'react';

import * as Components from '@components';
import * as Interfaces from '@interfaces';
import * as Config from '@config';
import * as Stores from '@stores';
import * as Types from '@types';

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
    const [items, setItems] = React.useState<Interfaces.NavMenuItem[]>([...defaultValues]);

    React.useEffect(() => {
        if (user) {
            setItems([
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
            ]);
        } else {
            setItems(defaultValues);
        }
    }, [user]);

    return (
        <>
            <Components.NavMobile items={items} />
            <Components.NavDesktop items={items} />
        </>
    );
};

export default Nav;
