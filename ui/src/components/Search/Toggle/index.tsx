import React from 'react';

import * as Components from '@/components';

const Search: React.FC = (): React.ReactElement => {
    return (
        <>
            <Components.SearchToggleMobile />
            <Components.SearchToggleDesktop />
        </>
    );
};

export default Search;
