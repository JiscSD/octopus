import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import * as Config from '@/config';
import * as Types from '@/types';

const useAuthStore = create<Types.AuthStoreType>()(
    devtools(
        persist(
            (set) => ({
                user: null,
                setUser: (user: null | Types.UserType) => set((state) => ({ user }))
            }),
            {
                name: Config.keys.localStorage.user,
                skipHydration: true
            }
        )
    )
);

export default useAuthStore;
