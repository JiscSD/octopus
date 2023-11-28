import { StateCreator, create } from 'zustand';

import * as Types from '@/types';
import * as Interfaces from '@/interfaces';

const initialPublicationVersion: Interfaces.PublicationVersion = {
    id: '',
    versionOf: '',
    versionNumber: 1,
    isLatestVersion: false,
    isLatestLiveVersion: false,
    createdBy: '',
    createdAt: '',
    updatedAt: '',
    currentStatus: 'DRAFT',
    publishedDate: null,
    title: '',
    licence: 'CC_BY',
    conflictOfInterestStatus: null,
    conflictOfInterestText: null,
    ethicalStatement: null,
    ethicalStatementFreeText: null,
    dataPermissionsStatement: null,
    dataPermissionsStatementProvidedBy: null,
    dataAccessStatement: null,
    selfDeclaration: false,
    description: null,
    keywords: [],
    content: null,
    language: 'en',
    fundersStatement: null,
    publication: {
        id: '',
        type: 'PROBLEM',
        doi: '',
        url_slug: ''
    },
    publicationStatus: [],
    funders: [],
    coAuthors: [],
    user: {
        id: '',
        orcid: '',
        firstName: '',
        lastName: '',
        email: '',
        createdAt: '',
        updatedAt: ''
    },
    topics: []
};

const createPublicationVersionSlice: StateCreator<Types.PublicationVersionSlice> = (set) => ({
    publicationVersion: initialPublicationVersion,
    updatePublicationVersion: (publicationVersion) => set({ publicationVersion }),
    updateAuthorAffiliations: (affiliations: Interfaces.MappedOrcidAffiliation[]) =>
        set((state) => ({
            publicationVersion: {
                ...state.publicationVersion,
                coAuthors: state.publicationVersion.coAuthors.map((author) =>
                    author.linkedUser === state.publicationVersion.createdBy ? { ...author, affiliations } : author
                )
            }
        })),
    updateIsIndependentAuthor: (isIndependent) =>
        set((state) => ({
            publicationVersion: {
                ...state.publicationVersion,
                coAuthors: state.publicationVersion.coAuthors.map((author) =>
                    author.linkedUser === state.publicationVersion.createdBy ? { ...author, isIndependent } : author
                )
            }
        })),
    updateCoAuthors: (coAuthors) =>
        set((state) => ({
            publicationVersion: {
                ...state.publicationVersion,
                coAuthors
            }
        })),
    updateTopics: (topics) =>
        set((state) => ({
            publicationVersion: {
                ...state.publicationVersion,
                topics
            }
        })),
    resetPublicationVersion: () => set({ publicationVersion: initialPublicationVersion })
});

const createLinkedToSlice: StateCreator<Types.LinkedToSlice> = (set) => ({
    linkedTo: [],
    updateLinkedTo: (linkedTo) => set({ linkedTo }),
    resetLinkedTo: () => set({ linkedTo: [] })
});

const createReferencesSlice: StateCreator<Types.ReferencesSlice> = (set) => ({
    references: [],
    updateReferences: (references) => set({ references }),
    resetReferences: () => set({ references: [] })
});

const createErrorSlice: StateCreator<Types.ErrorSlice> = (set) => ({
    error: null,
    setError: (error) => set({ error })
});

const usePublicationCreationStore = create<Types.PublicationCreationStoreType>()((...args) => ({
    ...createPublicationVersionSlice(...args),
    ...createLinkedToSlice(...args),
    ...createReferencesSlice(...args),
    ...createErrorSlice(...args)
}));

export default usePublicationCreationStore;
