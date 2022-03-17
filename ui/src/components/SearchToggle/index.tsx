import React from 'react';

import * as Components from '@components';

const Search: React.FC = (): JSX.Element => {
    return (
        <>
            <Components.SearchMobile />
            <Components.SearchDesktop />
        </>
    );
};

export default Search;
