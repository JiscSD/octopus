import { FC, useState, FormEvent, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/outline';

const classes = 'w-7 h-7 text-white transition-all rounded-full duration';

const EnableDarkMode: FC = (): JSX.Element => {
    const [on, setOn] = useState(false);

    const toggle = (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setOn(!on);
    };

    useEffect(() => {
        // Possibly replace with global store state
        on ? document.body.classList.add('dark') : document.body.classList.remove('dark');
    }, [on]);

    return (
        <button type="button" aria-pressed={on} onClick={(e) => toggle(e)}>
            {on && <SunIcon className={classes} />}
            {!on && <MoonIcon className={classes} />}
        </button>
    );
};

export default EnableDarkMode;
