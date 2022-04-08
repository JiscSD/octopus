import create from 'zustand';
import * as zustandMiddleware from 'zustand/middleware';

import * as Types from '@types';
import React from 'react';

let store: any = (set: any): Types.NoficiationStoreType => ({
    visible: false,
    toggleVisibility: (value: boolean) => set(() => ({ visible: value })),
    title: undefined,
    setTitle: (value: string | undefined) => set(() => ({ title: value })),
    message: undefined,
    setMessage: (value: string | undefined) => set(() => ({ message: value })),
    icon: undefined,
    setIcon: (value: React.ReactElement | undefined) => set(() => ({ icon: value })),
    dismiss: false,
    setDismiss: (value: boolean) => set(() => ({ dismiss: value }))
});

if (process.env.NEXT_PUBLIC_ENV === 'local') store = zustandMiddleware.devtools(store);

const useNoficiationStore = create<Types.NoficiationStoreType>(store);

export default useNoficiationStore;
