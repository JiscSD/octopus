import { useEffect, useState, useCallback } from 'react';

type Dimensions = {
    width: undefined | number;
    height: undefined | number;
};

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState<Dimensions>({
        width: undefined,
        height: undefined
    });

    const handleResize = useCallback(() => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);
    return windowSize;
};

export default useWindowSize;
