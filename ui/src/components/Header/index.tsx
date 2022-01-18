import { FC } from 'react';

import * as Assets from '@assets';

const Header: FC = (): JSX.Element => {
    return (
        <header className="bg-purple-500 bg-opacity-10">
            <Assets.Logo width={50} height={50} fill="red" />
        </header>
    );
};

export default Header;
