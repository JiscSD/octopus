import React from 'react';

import * as Components from '@components';
import * as Hooks from '@hooks';

const Search: React.FC = (): JSX.Element => {
    const screens = Hooks.useWindowSize();

    return (
        <>
            {screens.sm && <Components.SearchMobile />}
            {!screens.sm && <Components.SearchDesktop />}
        </>
    );
};

export default Search;
