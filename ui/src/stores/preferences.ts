import create from 'zustand';
import * as zustandMiddleware from 'zustand/middleware';

import * as Config from '@config';
import * as Types from '@types';

let store: any = (set: any): Types.PreferencesStoreTypes => ({
    darkMode: true,
    toggleDarkMode: () => set((state: Types.PreferencesStoreTypes) => ({ darkMode: !state.darkMode })),
    feedback: true,
    toggleFeedback: () => set((state: Types.PreferencesStoreTypes) => ({ feedback: !state.feedback }))
});

if (process.env.NEXT_PUBLIC_ENV === 'local') store = zustandMiddleware.devtools(store);

store = zustandMiddleware.persist(store, { name: Config.keys.localStorage.darkMode });

const usePreferencesStore = create<Types.PreferencesStoreTypes>(store);

export default usePreferencesStore;
