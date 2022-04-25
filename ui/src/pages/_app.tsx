import React from 'react';
import * as SWR from 'swr';
import * as Framer from 'framer-motion';
import NextNprogress from 'nextjs-progressbar';

import * as Components from '@components';
import * as Stores from '@stores';
import * as Types from '@types';
import * as api from '@api';

import '../styles/globals.css';

const App = ({ Component, pageProps }: Types.AppProps) => {
    const isMounted = React.useRef(false);
    const [loading, setLoading] = React.useState(true);
    const darkMode = Stores.usePreferencesStore((state) => state.darkMode);
    const showCmdPalette = Stores.useGlobalsStore((state) => state.showCmdPalette);
    const toggleCmdPalette = Stores.useGlobalsStore((state) => state.toggleCmdPalette);
    const user = Stores.useAuthStore((state) => state.user);

    const setUpCmdPalListeners = React.useCallback(() => {
        if (isMounted.current === true) {
            document.addEventListener('keydown', (e) => {
                if (window.navigator.appVersion.indexOf('Mac')) {
                    if (e.metaKey && e.code === 'KeyK') {
                        toggleCmdPalette();
                    }
                } else {
                    if (e.ctrlKey && e.code === 'KeyK') {
                        toggleCmdPalette();
                    }
                }

                if (e.key === 'Escape' && !showCmdPalette) toggleCmdPalette();
            });
        }
    }, [showCmdPalette, toggleCmdPalette]);

    React.useEffect(() => {
        isMounted.current = true;
        setUpCmdPalListeners();
        setLoading(false);
        return () => {
            isMounted.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <NextNprogress
                color={'#348cb1'}
                startPosition={0.3}
                stopDelayMs={200}
                height={4}
                showOnShallow={false}
                options={{
                    showSpinner: false
                }}
            />
            {!loading && (
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
        </>
    );
};

export default App;
