import create from 'zustand';
import { devtools } from 'zustand/middleware';

import * as Interfaces from '@interfaces';
import * as Config from '@config';
import * as Types from '@types';

let store: any = (set: (params: any) => void) => ({
    // Errors whilst editing
    error: null,
    setError: (error: string | null) => set(() => ({ error })),

    // ID
    id: '',
    updateId: (id: string) => set(() => ({ id })),

    // Title
    title: '',
    updateTitle: (title: string) => set(() => ({ title })),

    // Type
    type: Config.values.octopusInformation.publications.PROBLEM.id,
    updateType: (type: Types.PublicationType) => set(() => ({ type })),

    // Content
    content: '',
    updateContent: (content: string) => set(() => ({ content })),

    // Description
    description: '',
    updateDescription: (description: string) => set(() => ({ description })),

    // Keywords
    keywords: [],
    updateKeywords: (keywords: string[]) => set(() => ({ keywords })),

    // Licence
    licence: Config.values.octopusInformation.licences.CC_BY.value,
    updateLicence: (licence: Types.LicenceType) => set(() => ({ licence })),

    language: Config.values.octopusInformation.languages.find((entry) => entry.code === 'en'),
    updateLanguage: (language: Types.Languages) => set(() => ({ language })),

    // COI
    conflictOfInterestStatus: true,
    updateConflictOfInterestStatus: (conflictOfInterestStatus: boolean) => set(() => ({ conflictOfInterestStatus })),
    conflictOfInterestText: '',
    updateConflictOfInterestText: (conflictOfInterestText: string) => set(() => ({ conflictOfInterestText })),

    // Links
    linkTo: [],
    updateLinkTo: (linkTo: Interfaces.LinkTo[]) => set(() => ({ linkTo }))
});

if (process.env.NEXT_PUBLIC_ENV === 'local') store = devtools(store);

const usePublicationCreationStore = create<Types.PublicationCreationStoreType>(store);

export default usePublicationCreationStore;
