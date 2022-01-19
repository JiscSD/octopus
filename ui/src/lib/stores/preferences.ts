import create from 'zustand';
import { persist, devtools } from 'zustand/middleware';

import * as Config from '@config';

import { PreferencesStoreTypes } from '../types';

type State = {
    darkMode: boolean;
};

let store: any = (set: any): PreferencesStoreTypes => ({
    darkMode: false,
    toggle: () => set((state: State) => ({ darkMode: !state.darkMode }))
});

store = devtools(store);
store = persist(store, { name: Config.keys.localStorage.darkMode });

export const usePreferencesStore = create(store);
