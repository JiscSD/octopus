import type { AppProps } from 'next/app';
import { useEffect, useRef, useState } from 'react';

import { useDarkModeStore } from 'src/lib/stores/preferences';
import { DarkModeStore } from 'src/lib/types/stores';

import '../styles/globals.css';

const App = ({ Component, pageProps }: AppProps) => {
    const isMounted = useRef(false);
    const [loading, setLoading] = useState(true);
    const darkMode = useDarkModeStore((state: DarkModeStore) => state.darkMode);

    useEffect(() => {
        isMounted.current = true;
        setLoading(false);
        return () => {
            isMounted.current = false;
        };
    }, []);

    return (
        !loading && (
            <div className={darkMode && 'dark'}>
                <Component {...pageProps} />
            </div>
        )
    );
};

export default App;
