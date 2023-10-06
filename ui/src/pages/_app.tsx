import React, { useEffect } from 'react';
import Head from 'next/head';
import NextProgressBar from 'next-nprogress-bar';

import * as SWR from 'swr';
import * as Framer from 'framer-motion';
import * as Components from '@components';
import * as Stores from '@stores';
import * as Types from '@types';
import * as api from '@api';
import * as Contexts from '@contexts';
import * as Hooks from '@hooks';

import '../styles/globals.css';

type CustomProps = {
    protectedPage?: boolean;
};

const App = ({ Component, pageProps }: Types.AppProps<CustomProps>) => {
    const { user } = Stores.useAuthStore();
    const { darkMode } = Stores.usePreferencesStore();

    // check authentication client side
    Hooks.useAuthCheck(pageProps.protectedPage || false);

    // matomo tracking
    Hooks.useMatomoNext();

    useEffect(() => {
        Stores.usePreferencesStore.persist.rehydrate();
        Stores.useAuthStore.persist.rehydrate();
    }, []);

    return process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true' ? (
        <Components.Maintenance />
    ) : (
        <Contexts.ConfirmationModalProvider>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <NextProgressBar
                color="#348cb1"
                height="4px"
                options={{ showSpinner: false, minimum: 0.3, easing: 'ease-in', speed: 200 }}
            />

            <SWR.SWRConfig
                value={{
                    fetcher: (resource) => api.get(resource, user?.token).then((res) => res.data),
                    onError: (error) => {
                        console.error(error);
                    }
                }}
            >
                <Framer.MotionConfig reducedMotion="user">
                    <div className={darkMode ? 'dark' : ''}>
                        <div className="bg-teal-50 transition-colors duration-500 dark:bg-grey-800">
                            <Components.Toast />
                            <Component {...pageProps} />
                        </div>
                    </div>
                </Framer.MotionConfig>
            </SWR.SWRConfig>
        </Contexts.ConfirmationModalProvider>
    );
};

export default App;
