import { useRouter } from 'next/router';
import useSWR from 'swr';
import axios from 'axios';

import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as Stores from '@/stores';
import * as api from '@/api';

const useAuthCheck = (protectedPage: boolean) => {
    const router = useRouter();
    const { user, setUser } = Stores.useAuthStore();

    // verify JWT token
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

            // check if user logged in from a different tab
            if (decodedToken && !user) {
                setUser({ ...decodedToken, token });
            }

            // if token is valid, verify ORCID access also
            await api.get(Config.endpoints.verifyOrcidAccess, token);
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.log(axios.isAxiosError(error) ? error.response?.data.message : (error as Error).message);
            }

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
