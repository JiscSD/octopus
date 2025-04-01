import { create } from 'zustand';
import * as zustandMiddleware from 'zustand/middleware';

import * as Types from '@/types';
import * as Interfaces from '@/interfaces';

let store: any = (set: any): Types.ToastStoreType => ({
    toast: {
        visible: false,
        title: null,
        message: null,
        icon: null,
        dismiss: false
    },
    setToast: (toast: Interfaces.ToastState) => set(() => ({ toast })),
    clearToast: () =>
        set(() => ({
            toast: {
                visible: false,
                title: null,
                message: null,
                icon: null,
                dismiss: false
            }
        }))
});

if (process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF === 'local') store = zustandMiddleware.devtools(store);

const useNotificiationStore = create<Types.ToastStoreType>(store);

export default useNotificiationStore;
