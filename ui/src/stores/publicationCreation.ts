import create from 'zustand';
import { devtools } from 'zustand/middleware';

import * as Types from '@types';
import * as Interfaces from '@interfaces';

let store: any = (set: (params: any) => void) => ({
    error: null,
    setError: (error: string | null) => set((state: Types.PublicationCreationStoreType) => ({ error })),
    id: '',
    updateId: (id: string) => set((state: Types.PublicationCreationStoreType) => ({ id })),
    title: '',
    updateTitle: (title: string) => set((state: Types.PublicationCreationStoreType) => ({ title })),
    type: 'PROBLEM',
    updateType: (type: Types.PublicationType) => set((state: Types.PublicationCreationStoreType) => ({ type })),
    content: '',
    updateContent: (content: string) => set((state: Types.PublicationCreationStoreType) => ({ content })),
    licence: 'CC_BY',
    updateLicence: (licence: Types.LicenceType) => set((state: Types.PublicationCreationStoreType) => ({ licence })),
    conflictOfInterestStatus: true,
    updateConflictOfInterestStatus: (conflictOfInterestStatus: boolean) =>
        set((state: Types.PublicationCreationStoreType) => ({ conflictOfInterestStatus })),
    conflictOfInterestText: '',
    updateConflictOfInterestText: (conflictOfInterestText: string) =>
        set((state: Types.PublicationCreationStoreType) => ({ conflictOfInterestText })),
    linkTo: [],
    updateLinkTo: (linkTo: Array<Interfaces.LinkTo>) => set((state: Types.PublicationCreationStoreType) => ({ linkTo }))
});

if (process.env.NEXT_PUBLIC_ENV === 'local') store = devtools(store);

const usePublicationCreationStore = create<Types.PublicationCreationStoreType>(store);

export default usePublicationCreationStore;
