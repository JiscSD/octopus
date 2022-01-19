import { FC, useEffect, useState } from 'react';
import useWindowSize from 'src/lib/hooks/useWIndowSize';

import * as Components from '@components';
import * as Lib from '@lib';
import * as Config from '@config';

const items: Lib.I.NavMenuItem[] = [
    {
        label: 'Search',
        value: Config.urls.search.path
    },
    {
        label: 'Publish',
        value: Config.urls.createPublication.path
    },
    {
        label: 'Jisc',
        value: 'https://jisc.ac.uk'
    }
];

const Nav: FC = (): JSX.Element => {
    const screens = useWindowSize();

    return (
        <>
            {screens.sm && <Components.NavMobile items={items} />}
            {!screens.sm && <Components.NavDesktop items={items} />}
        </>
    );
};

export default Nav;
