import React from 'react';

import * as Components from '@components';
import * as Config from '@config';

const LogIn: React.FC = (): JSX.Element => (
    <Components.Link href={Config.urls.orcidLogin.path} className="mr-4">
        <span>Log in</span>
    </Components.Link>
);

export default LogIn;
