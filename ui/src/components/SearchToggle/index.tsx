import React from 'react';

import * as Components from '@/components';

const Search: React.FC = (): React.ReactElement => {
    return (
        <>
            <Components.SearchMobile />
            <Components.SearchDesktop />
        </>
    );
};

export default Search;
