import React from 'react';

import * as Components from '@components';

type Props = {
    fixedHeader?: boolean;
    children: React.ReactNode;
};

const Standard: React.FC<Props> = (props): JSX.Element => {
    return (
        <>
            <Components.JumpToContent />
            <Components.Header fixed={props.fixedHeader} />
            <main>{props.children}</main>
            <Components.Footer />
            <Components.ScrollToTop />
        </>
    );
};

export default Standard;
