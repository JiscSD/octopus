import React from 'react';

export type PreferencesStoreTypes = {
    darkMode: boolean;
    toggle: (e: React.FormEvent<HTMLButtonElement>) => void;
};

export type JSONValue = string | number | boolean | { [x: string]: JSONValue } | Array<JSONValue> | null | undefined;
