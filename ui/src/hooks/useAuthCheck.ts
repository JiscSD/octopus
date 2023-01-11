import { useCallback } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import axios from 'axios';

import * as Config from '@config';
import * as Helpers from '@helpers';
import * as Stores from '@stores';
import * as api from '@api';

const useAuthCheck = (protectedPage: boolean) => {
    const router = useRouter();
    const { user, setUser } = Stores.useAuthStore();

    const handleAuthCheckError = useCallback(
        (error: unknown) => {
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
        },
        [protectedPage, router.asPath, setUser]
    );

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
        } catch (error) {
            handleAuthCheckError(error);
        }
    });

    // verify ORCID access
    useSWR(Config.endpoints.verifyOrcidAccess, async (verifyOrcidAccessUrl) => {
        if (!user) {
            return;
        }

        try {
            await api.get(verifyOrcidAccessUrl, Helpers.getJWT());
        } catch (error) {
            handleAuthCheckError(error);
        }
    });
};

export default useAuthCheck;
