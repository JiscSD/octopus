import type { AppProps } from 'next/app';
import { useEffect, useRef, useState } from 'react';

import { PreferencesStoreTypes } from 'src/lib/types';
import { usePreferencesStore } from 'src/lib/stores/preferences';

import '../styles/globals.css';

const App = ({ Component, pageProps }: AppProps) => {
    const isMounted = useRef(false);
    const [loading, setLoading] = useState(true);
    const darkMode = usePreferencesStore((state: PreferencesStoreTypes) => state.darkMode);

    useEffect(() => {
        isMounted.current = true;
        setLoading(false);
        return () => {
            isMounted.current = false;
        };
    }, []);

    return (
        !loading && (
            <div className={`font-inter ${darkMode ? 'dark' : ''}`}>
                <Component {...pageProps} />
            </div>
        )
    );
};

export default App;
