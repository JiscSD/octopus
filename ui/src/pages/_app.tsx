import type { AppProps } from 'next/app';
import React from 'react';
import * as SWR from 'swr';

import * as Components from '@components';
import * as Types from '@types';
import * as Stores from '@stores';
import * as api from '@api';

import '../styles/globals.css';

const App = ({ Component, pageProps }: AppProps) => {
    const isMounted = React.useRef(false);
    const [loading, setLoading] = React.useState(true);
    const darkMode = Stores.usePreferencesStore((state: Types.PreferencesStoreTypes) => state.darkMode);

    const test = () => {
        alert('hello');
    };

    React.useEffect(() => {
        isMounted.current = true;

        if (isMounted.current === true) {
            document.addEventListener('keypress', test);
        }

        setLoading(false);
        return () => {
            isMounted.current = false;
        };
    }, []);

    return (
        !loading && (
            <SWR.SWRConfig
                value={{
                    fetcher: (resource) => api.get(resource),
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
                <div className={`font-inter antialiased ${darkMode ? 'dark' : ''} `}>
                    <Components.CommandPalette />
                    <Component {...pageProps} />
                </div>
            </SWR.SWRConfig>
        )
    );
};

export default App;
