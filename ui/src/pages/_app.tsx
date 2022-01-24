import type { AppProps } from 'next/app';
import React from 'react';

import * as Types from '@types';
import * as Stores from '@stores';

import '../styles/globals.css';

const App = ({ Component, pageProps }: AppProps) => {
    const isMounted = React.useRef(false);
    const [loading, setLoading] = React.useState(true);
    const darkMode = Stores.usePreferencesStore(
        (state: Types.PreferencesStoreTypes) => state.darkMode
    );

    React.useEffect(() => {
        isMounted.current = true;
        setLoading(false);
        return () => {
            isMounted.current = false;
        };
    }, []);

    return (
        !loading && (
            <div
                className={`antialiased font-inter ${darkMode ? 'dark' : ''} `}
            >
                <Component {...pageProps} />
            </div>
        )
    );
};

export default App;
