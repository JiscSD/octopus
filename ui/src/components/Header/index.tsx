import { FC } from 'react';

import * as Assets from '@assets';

const Header: FC = (): JSX.Element => {
    return (
        <header>
            <Assets.Logo width={50} height={50} fill="red" />
        </header>
    );
};

export default Header;
