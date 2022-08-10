import { useCallback, useEffect, useState } from 'react';

const getMatches = (query: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== 'undefined') {
        return window.matchMedia(query).matches;
    }
    return false;
};

const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState<boolean>(getMatches(query));

    const handleChange = useCallback(() => {
        setMatches(getMatches(query));
    }, [query]);

    useEffect(() => {
        const matchMedia = window.matchMedia(query);

        // Triggered at the first client-side load and if query changes
        handleChange();

        // Listen matchMedia
        matchMedia.addEventListener('change', handleChange);

        return () => {
            matchMedia.removeEventListener('change', handleChange);
        };
    }, [handleChange, query]);

    return matches;
};

export default useMediaQuery;
