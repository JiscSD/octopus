import { FC, ReactNode } from 'react';

import * as Components from '@components';

type Props = {
    fixedHeader?: boolean;
    children: ReactNode;
};

const Standard: FC<Props> = (props): JSX.Element => {
    return (
        <>
            <a id="top" href="#content" className="sr-only" title="jump to content" />
            <Components.Header fixed={props.fixedHeader} />
            <main id="content">{props.children}</main>
            <Components.Footer />
            <Components.ScrollToTop />
        </>
    );
};

export default Standard;
