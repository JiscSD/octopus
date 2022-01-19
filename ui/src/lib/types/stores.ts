import { FormEvent } from 'react';

export type DarkModeStore = {
    darkMode: boolean;
    toggle: (e: FormEvent<HTMLButtonElement>) => void;
};
