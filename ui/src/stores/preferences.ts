import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import * as Config from '@/config';
import * as Types from '@/types';

const usePreferencesStore = create<Types.PreferencesStoreTypes>()(
    devtools(
        persist(
            (set) => ({
                darkMode: true,
                toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
                showAnnouncementBanner: true,
                toggleAnnouncementBanner: () =>
                    set((state) => ({ showAnnouncementBanner: !state.showAnnouncementBanner }))
            }),
            {
                name: Config.keys.localStorage.preferences,
                skipHydration: true
            }
        )
    )
);

export default usePreferencesStore;
