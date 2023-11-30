import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import * as Config from '@config';
import * as Types from '@types';

const usePreferencesStore = create<Types.PreferencesStoreTypes>()(
    devtools(
        persist(
            (set) => ({
                darkMode: true,
                toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
                feedback: true,
                toggleFeedback: () => set((state) => ({ feedback: !state.feedback }))
            }),
            {
                name: Config.keys.localStorage.darkMode,
                skipHydration: true
            }
        )
    )
);

export default usePreferencesStore;
