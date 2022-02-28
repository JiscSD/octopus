import React from 'react';

import * as Components from '@components';
import * as Config from '@config';
import * as Assets from '@assets';

const LogIn: React.FC = (): JSX.Element => (
    <Components.Link
        href={Config.urls.orcidLogin.path}
        className="mr-2 flex items-center rounded-md bg-orcid p-2 lg:mr-4 lg:px-3"
    >
        <Assets.ORCID width={20} height={20} className="fill-white" />
        <span className="ml-2 hidden text-sm lg:block">Sign in with ORCID</span>
    </Components.Link>
);

export default LogIn;
