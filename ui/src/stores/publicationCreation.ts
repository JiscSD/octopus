import create from 'zustand';
import { devtools } from 'zustand/middleware';

import * as Interfaces from '@interfaces';
import * as Types from '@types';

let store: any = (set: (params: any) => void) => ({
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
    linkedFromPublication: null,
    updateLinkedFromPublication: (linkedFromPublication: Interfaces.Publication | null) =>
        set((state: Types.PublicationCreationStoreType) => ({ linkedFromPublication })),
    forPublicationsID: null,
    updateForPublicationsID: (forPublicationsID: string | string[] | null) =>
        set((state: Types.PublicationCreationStoreType) => ({ forPublicationsID })),
    draftedPublication: null,
    updateDraftedPublication: (draftedPublication: Interfaces.Publication | null) =>
        set((state: Types.PublicationCreationStoreType) => ({ draftedPublication }))
});

if (process.env.NEXT_PUBLIC_ENV === 'local') store = devtools(store);

const usePublicationCreationStore = create(store);

export default usePublicationCreationStore;
