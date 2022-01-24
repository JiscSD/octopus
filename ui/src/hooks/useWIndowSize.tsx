import React from 'react';

import * as Config from '@config';

type Dimensions = {
    width: number;
    height: number;
};

const useWindowSize = () => {
    const [windowSize, setWindowSize] = React.useState<Dimensions>({
        width: window.innerWidth,
        height: window.innerHeight
    });

    const handleResize = React.useCallback(() => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }, []);

    React.useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    return {
        sm: windowSize.width <= Config.screens.sm,
        md:
            windowSize.width <= Config.screens.md &&
            windowSize.width > Config.screens.sm,
        lg:
            windowSize.width <= Config.screens.lg &&
            windowSize.width > Config.screens.md,
        xl:
            windowSize.width <= Config.screens.xl &&
            windowSize.width > Config.screens.lg,
        xxl: windowSize.width > Config.screens.xl,
        windowHeight: windowSize.height
    };
};

export default useWindowSize;
