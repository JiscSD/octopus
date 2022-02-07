import React from 'react';

import * as Components from '@components';
import * as Interfaces from '@interfaces';
import * as Config from '@config';
import * as Hooks from '@hooks';

const items: Interfaces.NavMenuItem[] = [
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

    return (
        <>
            {screens.sm && <Components.NavMobile items={items} />}
            {!screens.sm && <Components.NavDesktop items={items} />}
        </>
    );
};

export default Nav;
