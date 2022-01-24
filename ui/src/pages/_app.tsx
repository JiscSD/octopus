import type { AppProps } from 'next/app';
import React from 'react';

import { PreferencesStoreTypes } from 'src/lib/types';
import { usePreferencesStore } from 'src/lib/stores/preferences';

import '../styles/globals.css';

const App = ({ Component, pageProps }: AppProps) => {
    const isMounted = React.useRef(false);
    const [loading, setLoading] = React.useState(true);
    const darkMode = usePreferencesStore((state: PreferencesStoreTypes) => state.darkMode);

    React.useEffect(() => {
        isMounted.current = true;
        setLoading(false);
        return () => {
            isMounted.current = false;
        };
    }, []);

    return (
        !loading && (
            <div className={`antialiased font-inter ${darkMode ? 'dark' : ''} `}>
                <Component {...pageProps} />
            </div>
        )
    );
};

export default App;
