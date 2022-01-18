import { FC, ReactNode } from 'react';

import * as Components from '@components';

type Props = { children: ReactNode };

const Standard: FC<Props> = (props): JSX.Element => {
    return (
        <>
            <a href="#content" className="sr-only">
                jump to content
            </a>
            <Components.Header />
            <main id="content">{props.children}</main>
            <Components.Footer />
        </>
    );
};

export default Standard;
