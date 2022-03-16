import React from 'react';
import * as SWR from 'swr';
import NextNprogress from 'nextjs-progressbar';

import * as Components from '@components';
import * as Stores from '@stores';
import * as Types from '@types';
import * as api from '@api';

import '../styles/globals.css';

const App = ({ Component, pageProps }: Types.AppProps) => {
    const isMounted = React.useRef(false);
    const [loading, setLoading] = React.useState(true);
    const darkMode = Stores.usePreferencesStore((state: Types.PreferencesStoreTypes) => state.darkMode);
    const showCmdPalette = Stores.useGlobalsStore((state: Types.GlobalsStoreType) => state.showCmdPalette);
    const toggleCmdPalette = Stores.useGlobalsStore((state: Types.GlobalsStoreType) => state.toggleCmdPalette);

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
                color={darkMode ? '#348cb1' : '#c4e1ee'}
                startPosition={0.3}
                stopDelayMs={200}
                height={3}
                showOnShallow={false}
                options={{
                    showSpinner: false
                }}
            />
            {!loading && (
                <SWR.SWRConfig
                    value={{
                        fetcher: (resource) => api.get(resource, undefined),
                        fallback: pageProps.fallback,
                        errorRetryCount: 3,
                        refreshInterval: 60000, // for dev
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
                    <div className={darkMode ? 'dark' : ''}>
                        <div className="relative">
                            <div className="absolute inset-0 z-0 bg-gradient-to-b from-white to-teal-50 opacity-100 transition-opacity duration-500 dark:opacity-0" />
                            <div className="absolute inset-0 z-0 bg-grey-800 opacity-0 transition-opacity duration-500 dark:opacity-100" />
                            <div className="relative z-10">
                                <Components.CommandPalette />
                                <Component {...pageProps} />
                            </div>
                        </div>
                    </div>
                </SWR.SWRConfig>
            )}
        </>
    );
};

export default App;
