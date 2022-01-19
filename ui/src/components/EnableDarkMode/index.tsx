import { FC, FormEvent } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/outline';

import { useDarkModeStore } from 'src/lib/stores/preferences';
import { DarkModeStore } from 'src/lib/types/stores';

const classes = 'w-7 h-7 text-white transition-all rounded-full duration';

const EnableDarkMode: FC = (): JSX.Element => {
    const darkMode = useDarkModeStore((state: DarkModeStore) => state.darkMode);
    const toggle = useDarkModeStore((state: DarkModeStore) => state.toggle);

    return (
        <button type="button" aria-pressed={darkMode} onClick={(e) => toggle(e)}>
            {darkMode && <SunIcon className={classes} />}
            {!darkMode && <MoonIcon className={classes} />}
        </button>
    );
};

export default EnableDarkMode;
