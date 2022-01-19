import create from 'zustand';
import { persist, devtools } from 'zustand/middleware';

import * as Config from '@config';

import { DarkModeStore } from '../types/stores';

type State = {
    darkMode: boolean;
};

let store: any = (set: any): DarkModeStore => ({
    darkMode: false,
    toggle: () => set((state: State) => ({ darkMode: !state.darkMode }))
});

store = devtools(store);
store = persist(store, { name: Config.keys.localStorage.darkMode });

export const useDarkModeStore = create(store);
