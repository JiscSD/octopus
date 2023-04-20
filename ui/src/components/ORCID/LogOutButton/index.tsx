import React from 'react';

import * as Router from 'next/router';
import * as Helpers from '@helpers';
import * as Stores from '@stores';
import * as Config from '@config';
import * as Types from '@types';
import * as Components from '@components';

const LogOutButton: React.FC = (): React.ReactElement => {
    const router = Router.useRouter();
    const setUser = Stores.useAuthStore((state: Types.AuthStoreType) => state.setUser);

    const handleLogOut = async () => {
        await router.push({
            pathname: `${Config.urls.home.path}`
        });
        Helpers.clearJWT();
        setUser(null);
    };

    return (
        <Components.Link
            href="#"
            onClick={handleLogOut}
            className="block w-full rounded border-transparent p-1 text-left outline-0 focus:ring-2 focus:ring-yellow-400"
        >
            Log out
        </Components.Link>
    );
};

export default LogOutButton;
