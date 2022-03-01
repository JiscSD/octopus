import create from 'zustand';
import * as zustandMiddleware from 'zustand/middleware';

import * as Interfaces from '@interfaces';
import * as Config from '@config';
import * as Types from '@types';

type State = {
    user: null | {};
};

let store: any = (set: any): Types.AuthStoreType => ({
    user: null,
    setUser: (user: any) => set((state: State) => ({ user }))
});

if (process.env.NEXT_PUBLIC_ENV === 'local') store = zustandMiddleware.devtools(store);

store = zustandMiddleware.persist(store, { name: Config.keys.localStorage.user });

const useAuthStore = create(store);

export default useAuthStore;
