import create from 'zustand';
import * as zustandMiddleware from 'zustand/middleware';

import * as Types from '@types';

type State = {
    showCmdPalette: boolean;
};

let store: any = (set: any): Types.GlobalsStoreType => ({
    showCmdPalette: false,
    toggleCmdPalette: () => set((state: State) => ({ showCmdPalette: !state.showCmdPalette }))
});

if (process.env.NEXT_PUBLIC_ENV === 'local') store = zustandMiddleware.devtools(store);

const useGlobalsStore = create(store);

export default useGlobalsStore;
