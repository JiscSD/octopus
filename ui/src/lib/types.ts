import React from 'react';

export type PreferencesStoreTypes = {
    darkMode: boolean;
    toggle: (e: React.FormEvent<HTMLButtonElement>) => void;
};
