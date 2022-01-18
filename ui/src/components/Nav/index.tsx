import { FC, useEffect, useState } from 'react';
import useWindowSize from 'src/lib/hooks/useWIndowSize';

import * as Components from '@components';

const items = [
    {
        label: 'Search',
        value: 'asasasas'
    },
    {
        label: 'Publish',
        value: 'sdsdsd'
    }
];

const Nav: FC = (): JSX.Element => {
    const [mobile, setMobile] = useState(false);

    const { width } = useWindowSize();

    useEffect(() => {
        if (width && width > 960) {
            setMobile(false);
        } else {
            setMobile(true);
        }
    }, [width]);

    return (
        <>
            {mobile && <Components.NavMobile items={items} />}
            {!mobile && <Components.NavDesktop items={items} />}
        </>
    );
};

export default Nav;
