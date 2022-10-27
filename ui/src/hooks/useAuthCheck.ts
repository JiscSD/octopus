import { useRouter } from 'next/router';
import useSWR from 'swr';

import * as Config from '@config';
import * as Helpers from '@helpers';
import * as Stores from '@stores';
import * as api from '@api';

const useAuthCheck = (protectedPage: boolean) => {
    const router = useRouter();
    const { user, setUser } = Stores.useAuthStore();

    useSWR(Config.endpoints.decodeUserToken, async (decodeUserTokenUrl) => {
        // ignore if user is on the login page
        if (router.pathname.startsWith('/login')) {
            return;
        }

        const token = Helpers.getJWT();

        try {
            if (!token) {
                // skip the call to the backend if there's no token
                throw new Error('No token found');
            }
            // will throw an error if token is not valid
            const response = await api.get(decodeUserTokenUrl, token);
            const decodedToken = response.data;

            if (decodedToken && !user) {
                setUser({ ...decodedToken, token });
            }
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.log((error as Error).message);
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
