import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import NextProgressBar from 'nextjs-progressbar';

import * as SWR from 'swr';
import * as Framer from 'framer-motion';
import * as Components from '@components';
import * as Stores from '@stores';
import * as Types from '@types';
import * as api from '@api';
import * as Contexts from '@contexts';
import * as Hooks from '@hooks';

import '../styles/globals.css';

const App = ({ Component, pageProps }: Types.AppProps) => {
    const [mounted, setMounted] = useState(false);
    const { user } = Stores.useAuthStore();
    const { darkMode } = Stores.usePreferencesStore();
    const { showCmdPalette, toggleCmdPalette } = Stores.useGlobalsStore();

    // check authentication client side
    Hooks.useAuthCheck(Boolean(pageProps.protectedPage));

    // matomo tracking
    Hooks.useMatomoNext();

    useEffect(() => {
        setMounted(true);

        const setUpCmdPalListeners = (e: KeyboardEvent) => {
            if (window.navigator.userAgent.indexOf('Mac') !== -1) {
                if (e.metaKey && e.code === 'KeyK') {
                    toggleCmdPalette();
                }
            } else {
                if (e.ctrlKey && e.code === 'KeyK') {
                    toggleCmdPalette();
                }
            }

            if (e.key === 'Escape' && showCmdPalette) {
                toggleCmdPalette();
            }
        };

        document.addEventListener('keydown', setUpCmdPalListeners);
        return () => {
            setMounted(false);
            document.removeEventListener('keydown', setUpCmdPalListeners);
        };
    }, [showCmdPalette, toggleCmdPalette]);

    return (
        <Contexts.ConfirmationModalProvider>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <NextProgressBar
                color={'#348cb1'}
                startPosition={0.3}
                stopDelayMs={200}
                height={4}
                showOnShallow={false}
                options={{
                    showSpinner: false
                }}
            />

            {mounted && (
                <SWR.SWRConfig
                    value={{
                        fetcher: (resource) => api.get(resource, user?.token),
                        fallback: pageProps.fallback,
                        errorRetryCount: 3,
                        refreshInterval: 600000000, // for dev
                        onError: (error, key) => {
                            if (error.status === 403) {
                                console.log('403 error');
                            }

                            if (error.status === 401) {
                                console.log('401 error');
                            }
                        }
                    }}
                >
                    <Framer.MotionConfig reducedMotion="user">
                        <div className={darkMode ? 'dark' : ''}>
                            <div className="bg-teal-50 transition-colors duration-500 dark:bg-grey-800">
                                <Components.Toast />
                                <Components.CommandPalette />
                                <Component {...pageProps} />
                            </div>
                        </div>
                    </Framer.MotionConfig>
                </SWR.SWRConfig>
            )}
        </Contexts.ConfirmationModalProvider>
    );
};

export default App;
