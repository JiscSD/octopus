import { useRouter } from 'next/router';
import useSWR from 'swr';

import * as Config from '@config';
import * as Helpers from '@helpers';
import * as Stores from '@stores';
import * as api from '@api';

const useAuthCheck = (protectedPage: boolean) => {
    const router = useRouter();
    const { setUser } = Stores.useAuthStore();

    useSWR(Config.endpoints.verifyToken, async (verifyTokenUrl) => {
        // ignore if user is on the login page
        if (router.pathname.startsWith('/login')) {
            return;
        }

        const token = Helpers.getJWT();

        try {
            // will throw an error if token is not valid
            await api.get(verifyTokenUrl, token);
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.log(error);
            }

            // check if current page is protected
            if (protectedPage) {
                // redirect user to ORCID login
                return window.location.assign(
                    `${Config.urls.orcidLogin.path}&state=${encodeURIComponent(router.asPath)}`
                );
            }

            // log user out
            setUser(null);
            Helpers.clearJWT();
        }
    });
};

export default useAuthCheck;
