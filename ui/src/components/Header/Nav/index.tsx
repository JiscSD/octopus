import React from 'react';

import * as Components from '@components';
import * as Interfaces from '@interfaces';
import * as Config from '@config';
import * as Stores from '@stores';
import * as Hooks from '@hooks';
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

const Nav: React.FC = (): JSX.Element => {
    const screens = Hooks.useWindowSize();
    const user = Stores.useAuthStore((state: Types.AuthStoreType) => state.user);
    const [items, setItems] = React.useState<Interfaces.NavMenuItem[]>([...defaultValues]);

    React.useEffect(() => {
        if (user) {
            setItems((prevState) => [
                ...prevState,
                {
                    label: `${user?.firstName} ${user?.lastName}`,
                    value: '#',
                    subItems: [
                        { label: 'Profile', value: `${Config.urls.viewUser.path}/${user.id}` },
                        <Components.ORCIDLogOutButton key={user.id} />
                    ]
                }
            ]);
        } else {
            setItems(defaultValues);
        }
    }, [user]);

    return <>{screens.sm ? <Components.NavMobile items={items} /> : <Components.NavDesktop items={items} />}</>;
};

export default Nav;
