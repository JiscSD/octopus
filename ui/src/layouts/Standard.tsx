import { FC, ReactNode } from 'react';

import * as Components from '@components';

type Props = { children: ReactNode };

const Standard: FC<Props> = (props): JSX.Element => {
    return (
        <>
            <Components.Header />
            <main>{props.children}</main>
            <footer>dsdsds</footer>
        </>
    );
};

export default Standard;
