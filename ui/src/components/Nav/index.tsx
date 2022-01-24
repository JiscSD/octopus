import React from 'react';

import * as Components from '@components';
import * as Interfaces from '@interfaces';
import * as Hooks from '@hooks';
import * as Config from '@config';

const items: Interfaces.NavMenuItem[] = [
    {
        label: 'Learn',
        value: '#learn'
    },
    {
        label: 'Browse',
        value: '#browse'
    },
    {
        label: 'Search',
        value: Config.urls.search.path
    },
    {
        label: 'Publish',
        value: Config.urls.createPublication.path
    }
];

const Nav: React.FC = (): JSX.Element => {
    const screens = Hooks.useWindowSize();

    return (
        <>
            {screens.sm && <Components.NavMobile items={items} />}
            {!screens.sm && <Components.NavDesktop items={items} />}
        </>
    );
};

export default Nav;
