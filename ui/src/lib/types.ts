import { FormEvent } from 'react';

export type PreferencesStoreTypes = {
    darkMode: boolean;
    toggle: (e: FormEvent<HTMLButtonElement>) => void;
};
